import 'reflect-metadata';

import { ReplaySubject, Subject } from 'rxjs';
import { Namespace, Server } from 'socket.io';

import { Injectable, MetaType } from '../common/interfaces';
import { NAMESPACE_METADATA, PORT_METADATA } from './constants';
import { InvalidSocketPortException } from './exceptions';
import { GatewayMetadataExplorer, MessageMappingProperty } from './gateway-metadata.explorer';
import { Gateway, ObservableSocketServer } from './interfaces';
import { SocketServerProvider } from './socket-server.provider';

/**
 * Websockets controller.
 */
export class WebSocketsController {
  private readonly explorer = new GatewayMetadataExplorer();
  private readonly CONNECTION_EVENT = 'connection';
  private readonly DISCONNECT_EVENT = 'disconnect';

  constructor(private readonly provider: SocketServerProvider) {
  }

  /**
   * Hook a Gateway instance into and Observable Server.
   *
   * @param instance Instance to be bound.
   * @param metaType Injectable object instance to be used.
   */
  hookGatewayIntoServer(instance: Gateway, metaType: MetaType<Injectable>): void {
    const namespace = Reflect.getMetadata(NAMESPACE_METADATA, metaType) || '';
    const port = Reflect.getMetadata(PORT_METADATA, metaType) || 80;

    if (!Number.isInteger(port)) {
      throw new InvalidSocketPortException(port, metaType);
    }

    this.subscribeObservableServer(instance, namespace, port);
  }

  /**
   * Subscribe an ObservableSocketServer with given namespace and port number.
   *
   * @param instance Instance to be bound.
   * @param namespace Server namespace.
   * @param port Server port.
   */
  subscribeObservableServer(instance: Gateway, namespace: string, port: number): void {
    const messageHandlers = this.explorer.explore(instance);
    const observableServer = this.provider.scanForSocketServer(namespace, port);

    this.hookServerToProperties(instance, observableServer.server);
    this.subscribeEvents(instance, messageHandlers, observableServer);
  }

  /**
   * Subscribes tne Init, Connection, and Disconnect events to given instance.
   *
   * @param instance Instance to be bound.
   * @param messageHandlers Message list to be subscribed.
   * @param observableServer ObservableSocketServer to be used.
   */
  subscribeEvents(
    instance: Gateway,
    messageHandlers: MessageMappingProperty[],
    observableServer: ObservableSocketServer,
  ): void {
    const {
      init,
      connection,
      disconnect,
      server,
    } = observableServer;

    this.subscribeInitEvent(instance, init);

    init.next(server);
    server.on(this.CONNECTION_EVENT, this.getConnectionHandler(this, instance, messageHandlers, disconnect, connection));
  }

  getConnectionHandler(
    context: WebSocketsController,
    instance: Gateway,
    messageHandlers: MessageMappingProperty[],
    disconnect: Subject<any>,
    connection: Subject<any>,
  ) {
    return (client) => {
      context.subscribeConnectionEvent(instance, connection);
      connection.next(client);

      context.subscribeMessages(messageHandlers, client, instance);
      context.subscribeDisconnectEvent(instance, disconnect);

      client.on(context.DISCONNECT_EVENT, (client) => disconnect.next(client));
    };
  }

  /**
   * Subscribe the Init event to given instance.
   *
   * @param instance Instance to be bound.
   * @param event Init event.
   */
  subscribeInitEvent(instance: Gateway, event: ReplaySubject<any>): void {
    if (instance.afterInit) {
      event.subscribe(instance.afterInit.bind(instance));
    }
  }

  /**
   * Subscribe the Connection event to given instance.
   *
   * @param instance Instance to be bound.
   * @param event Connection event.
   */
  subscribeConnectionEvent(instance: Gateway, event: Subject<any>): void {
    if (instance.handleConnection) {
      event.subscribe(instance.handleConnection.bind(instance));
    }
  }

  /**
   * Subscribe the Disconnect event to given instance.
   *
   * @param instance Instance to be bound.
   * @param event Disconnect event.
   */
  subscribeDisconnectEvent(instance: Gateway, event: Subject<any>) {
    if (instance.handleDisconnect) {
      event.subscribe(instance.handleDisconnect.bind(instance));
    }
  }

  /**
   * Subscribe the message list to given instance.
   *
   * @param messageHandlers Message list.
   * @param client Client object.
   * @param instance Instance to be bound.
   */
  subscribeMessages(
    messageHandlers: MessageMappingProperty[],
    client: any,
    instance: Gateway,
  ) {
    messageHandlers.forEach(({
      message,
      callback,
    }: MessageMappingProperty) => {
      client.on(message, callback.bind(instance, client));
    });
  }

  /**
   * Hook Server properties to given instance.
   *
   * @param instance Instance to be analyzed.
   * @param server Server IO object.
   */
  private hookServerToProperties(instance: Gateway, server: Server | Namespace): void {
    for (const property of this.explorer.scanForServerHooks(instance)) {
      Reflect.set(instance, property, server);
    }
  }
}
