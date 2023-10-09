import 'reflect-metadata';

import { IInjectable } from '../common/interfaces';
import { InvalidServerSocketPortException } from './exceptions';
import { GatewayMetadataExplorer, MessageMappingProperties } from './explorer';
import { IGateway, ObservableSocketServer } from './interfaces';
import { SocketServerProvider } from './provider';
import { Subject } from 'rxjs';

/**
 * Observable Socket Servers Controller
 */
export class SubjectsController {
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
    const namespace = Reflect.getMetadata('namespace', prototype) || '';
    const port = Reflect.getMetadata('port', prototype) || 80;

    if (!Number.isInteger(port)) {
      throw new InvalidServerSocketPortException(port, (<any>prototype).name);
    }

    this.subscribeServer(instance, namespace, port);
  }

  private subscribeServer(instance: IGateway, namespace: string, port: number): void {
    const messages = GatewayMetadataExplorer.explore(instance);
    const server = this.provider.scanForSocketServer(namespace, port);

    this.hookServerToProperties(instance, server);
    this.subscribeEvents(instance, messages, server);
  }

  private hookServerToProperties(instance: IGateway, server: ObservableSocketServer): void {
    for (const property of GatewayMetadataExplorer.scanForServerHooks(instance)) {
      Reflect.set(instance, property, server);
    }
  }

  private subscribeEvents(
    instance: IGateway,
    messages: MessageMappingProperties[],
    socketServer: ObservableSocketServer,
  ) {
    const {
      init,
      disconnect,
      connection,
      server,
    } = socketServer;

    this.subscribeInitEvent(instance, init);
    init.next(server);

    server.on('connection', (client) => {
      this.subscribeConnectionEvent(instance, connection);
      connection.next(client);

      this.subscribeMessages(messages, client, instance);
      this.subscribeDisconnectEvent(instance, disconnect);
      client.on('disconnect', (client) => disconnect.next(client));
    });
  }

  private subscribeInitEvent(instance: IGateway, event: Subject<any>) {
    if (instance.afterInit) {
      event.subscribe(instance.afterInit.bind(instance));
    }
  }

  private subscribeConnectionEvent(instance: IGateway, event: Subject<any>) {
    if (instance.handleConnection) {
      event.subscribe(instance.handleConnection.bind(instance));
    }
  }

  private subscribeDisconnectEvent(instance: IGateway, event: Subject<any>) {
    if (instance.handleDisconnect) {
      event.subscribe(instance.handleDisconnect.bind(instance));
    }
  }

  private subscribeMessages(messageHandlers: MessageMappingProperties[], client: any, instance: IGateway) {
    messageHandlers.map(({ message, callback }) => {
      client.on(message, callback.bind(instance, client));
    });
  }
}
