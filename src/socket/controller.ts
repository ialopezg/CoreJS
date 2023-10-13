import 'reflect-metadata';

import { IInjectable } from '../common/interfaces';
import { InvalidServerSocketPortException } from './exceptions';
import { GatewayMetadataExplorer, MessageMappingProperties } from './explorer';
import { IGateway, ObservableSocketServer } from './interfaces';
import { SocketServerProvider } from './provider';
import { Subject } from 'rxjs';
import { NAMESPACE_METADATA, PORT_METADATA } from './constants';

/**
 * Observable Socket Servers Controller
 */
export class SubjectsController {
  private readonly CONNECTION_EVENT = 'connection';
  private readonly DISCONNECT_EVENT = 'disconnect';

  /**
   * Creates a new instance of SubjectsController class.
   *
   * @param {SocketServerProvider} provider Socket Server Provider.
   */
  constructor(private readonly provider: SocketServerProvider) {}

  /**
   * Register a gateway service into the socket module.
   *
   * @param {IGateway} instance Gateway service to be registered.
   * @param {IInjectable} prototype Component that contains the gateway service.
   */
  public hookGateway(instance: IGateway, prototype: IInjectable): void {
    const namespace = Reflect.getMetadata(NAMESPACE_METADATA, prototype) ?? '';
    const port = Reflect.getMetadata(PORT_METADATA, prototype) ?? 80;

    if (!Number.isInteger(port)) {
      throw new InvalidServerSocketPortException(port, (<any>prototype).name);
    }

    this.subscribeServer(instance, namespace, port);
  }

  private subscribeServer(target: IGateway, namespace: string, port: number): void {
    const messages = GatewayMetadataExplorer.explore(target);
    const server = this.provider.scan(namespace, port);

    this.hookServer(target, server);
    this.subscribeEvents(target, messages, server);
  }

  private hookServer(target: IGateway, server: ObservableSocketServer): void {
    for (const property of GatewayMetadataExplorer.scanForServerHooks(target)) {
      Reflect.set(target, property, server);
    }
  }

  private subscribeEvents(
    target: IGateway,
    messages: MessageMappingProperties[],
    socketServer: ObservableSocketServer,
  ) {
    const {
      init,
      disconnect,
      connection,
      server,
    } = socketServer;

    this.subscribeInitEvent(target, init);

    init.next(server);
    server.on(this.CONNECTION_EVENT, (client) => {
      this.subscribeConnectionEvent(target, connection);
      connection.next(client);

      this.subscribeMessages(messages, client, target);
      this.subscribeDisconnectEvent(target, disconnect);

      client.on(this.DISCONNECT_EVENT, (client) => disconnect.next(client));
    });
  }

  private subscribeInitEvent(target: IGateway, event: Subject<any>) {
    if (target.afterInit) {
      event.subscribe(target.afterInit.bind(target));
    }
  }

  private subscribeConnectionEvent(target: IGateway, event: Subject<any>) {
    if (target.handleConnection) {
      event.subscribe(target.handleConnection.bind(target));
    }
  }

  private subscribeDisconnectEvent(target: IGateway, event: Subject<any>) {
    if (target.handleDisconnect) {
      event.subscribe(target.handleDisconnect.bind(target));
    }
  }

  private subscribeMessages(messageHandlers: MessageMappingProperties[], client: any, target: IGateway) {
    messageHandlers.map(({ message, callback }) => {
      client.on(message, callback.bind(target, client));
    });
  }
}
