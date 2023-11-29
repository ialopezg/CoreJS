import 'reflect-metadata';

import { Injectable, MetaType } from '../common/interfaces';
import { InvalidServerSocketPortException } from './exceptions';
import { GatewayMetadataExplorer, MessageMappingProperties } from './explorer';
import { Gateway, ObservableSocketServer } from './interfaces';
import { SocketServerProvider } from './provider';
import { Subject } from 'rxjs';
import { NAMESPACE_METADATA, PORT_METADATA } from './constants';

/**
 * Observable Socket Servers Controller
 */
export class WebSocketsController {
  private explorer = new GatewayMetadataExplorer();
  private readonly CONNECTION_EVENT = 'connection';
  private readonly DISCONNECT_EVENT = 'disconnect';

  /**
   * Creates a new instance of SubjectsController class.
   *
   * @param {SocketServerProvider} provider Socket Server Provider.
   */
  constructor(private readonly provider: SocketServerProvider) {}

  /**
   * Register a gateway service into the websocket module.
   *
   * @param {Gateway} instance Gateway service to be registered.
   * @param {Injectable} metaType Component that contains the gateway service.
   */
  public hook(instance: Gateway, metaType: MetaType<Injectable>): void {
    const namespace = Reflect.getMetadata(NAMESPACE_METADATA, metaType) ?? '';
    const port = Reflect.getMetadata(PORT_METADATA, metaType) ?? 80;

    if (!Number.isInteger(port)) {
      throw new InvalidServerSocketPortException(port, metaType.name);
    }

    this.subscribeServer(instance, namespace, port);
  }

  private subscribeServer(target: Gateway, namespace: string, port: number): void {
    const messages = this.explorer.explore(target);
    const server = this.provider.scan(namespace, port);

    this.hookServer(target, server);
    this.subscribeEvents(target, messages, server);
  }

  private hookServer(target: Gateway, server: ObservableSocketServer): void {
    for (const property of this.explorer.scanForServerHooks(target)) {
      Reflect.set(target, property, server);
    }
  }

  private subscribeEvents(
    target: Gateway,
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
    server.on(
      this.CONNECTION_EVENT,
      this.getConnectionHandler(
        this,
        target,
        messages,
        connection,
        disconnect,
      ),
    );
  }

  private getConnectionHandler(
    context: WebSocketsController,
    target: Gateway,
    messages: MessageMappingProperties[],
    connection: Subject<any>,
    disconnect: Subject<any>,
  ): (socket: any) => void {
    return (client) => {
      context.subscribeConnectionEvent(target, connection);
      connection.next(client);

      context.subscribeMessages(messages, client, target);
      context.subscribeDisconnectEvent(target, disconnect);

      client.on(context.DISCONNECT_EVENT, (client) => disconnect.next(client));
    }
  }

  private subscribeInitEvent(target: Gateway, event: Subject<any>) {
    if (target.afterInit) {
      event.subscribe(target.afterInit.bind(target));
    }
  }

  private subscribeConnectionEvent(target: Gateway, event: Subject<any>) {
    if (target.handleConnection) {
      event.subscribe(target.handleConnection.bind(target));
    }
  }

  private subscribeDisconnectEvent(target: Gateway, event: Subject<any>) {
    if (target.handleDisconnect) {
      event.subscribe(target.handleDisconnect.bind(target));
    }
  }

  private subscribeMessages(messageHandlers: MessageMappingProperties[], client: any, target: Gateway) {
    messageHandlers.map(({ message, callback }) => {
      client.on(message, callback.bind(target, client));
    });
  }
}
