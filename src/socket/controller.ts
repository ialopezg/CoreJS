import 'reflect-metadata';

import { ReplaySubject, Subject } from 'rxjs';
import { Namespace, Server } from 'socket.io';

import { Injectable } from '../common/interfaces';
import { InvalidSocketPortException } from './exceptions';
import { GatewayMetadataExplorer, MessageMappingProperty } from './explorer';
import { Gateway, ObservableSocketServer } from './interfaces';
import { SocketServerProvider } from './provider';

/**
 * Defines a subjects controller.
 */
export class SubjectsController {
  constructor(private readonly provider: SocketServerProvider) {}

  /**
   * Hook a Gateway instance into and Observable Server.
   *
   * @param instance Instance to be binded.
   * @param component Injectable object instance to be used.
   */
  hookGatewayIntoServer(instance: Gateway, component: Injectable): void {
    const namespace = Reflect.getMetadata('namespace', component) || '';
    const port = Reflect.getMetadata('port', component) || 8080;

    if (!Number.isInteger(port)) {
      throw new InvalidSocketPortException(port, component);
    }

    this.subscribeObservableServer(instance, namespace, port);
  }

  /**
   * Subscribe an ObservableSocketServer with given namespace and port number.
   *
   * @param instance Instance to be binded.
   * @param namespace Server namespace.
   * @param port Server port.
   */
  private subscribeObservableServer(instance: Gateway, namespace: string, port: number): void {
    const messageHandlers = GatewayMetadataExplorer.explore(instance);
    const observableServer = this.provider.scanForSocketServer(namespace, port);

    this.hookServerToProperties(instance, observableServer.server);
    this.subscribeEvents(instance, messageHandlers, observableServer);
  }

  /**
   * Hook Server properties to given instance.
   *
   * @param instance Instance to be analyzed.
   * @param server Server IO object.
   */
  private hookServerToProperties(instance: Gateway, server: Server | Namespace): void {
    for (const property of GatewayMetadataExplorer.scanForServerHooks(instance)) {
      Reflect.set(instance, property, server);
    }
  }

  /**
   * Subscribes tne Init, COnnection, and Disconnect events to given instance.
   *
   * @param instance Instance to be binded.
   * @param messageHandlers Message list to be subscribed.
   * @param observableServer ObservableSocketServer to be used.
   */
  private subscribeEvents(
    instance: Gateway,
    messageHandlers: MessageMappingProperty[],
    observableServer: ObservableSocketServer,
  ): void {
    const { init, connection, disconnect, server } = observableServer;

    this.subscribeInitEvent(instance, init);
    init.next(server);

    server.on('connection', (client: any) => {
      this.subscribeConnectionEvent(instance, connection);
      connection.next(client);

      this.subscribeMessages(messageHandlers, client, instance);
      this.subscribeDisconnectEvent(instance, disconnect);
      client.on('disconnect', (client: any) => disconnect.next(client));
    });
  }

  /**
   * Subscribe the Init event to given instance.
   *
   * @param instance Instance to be binded.
   * @param event Init event.
   */
  private subscribeInitEvent(instance: Gateway, event: ReplaySubject<any>): void {
    if (instance.afterInit) {
      event.subscribe(instance.afterInit.bind(instance));
    }
  }

  /**
   * Subscribe the Connection event to given instance.
   *
   * @param instance Instance to be binded.
   * @param event Connection event.
   */
  private subscribeConnectionEvent(instance: Gateway, event: Subject<any>): void {
    if (instance.handleConnection) {
      event.subscribe(instance.handleConnection.bind(instance));
    }
  }

  /**
   * Subscribe the Disconnect event to given instance.
   *
   * @param instance Instance to be binded.
   * @param event Disconnect event.
   */
  private subscribeDisconnectEvent(instance: Gateway, event: Subject<any>) {
    if (instance.handleDisconnect) {
      event.subscribe(instance.handleDisconnect.bind(instance));
    }
  }

  /**
   * Subscribe the message list to given instance.
   *
   * @param messageHandlers Message list.
   * @param client Client object.
   * @param instance Instance to be binded.
   */
  private subscribeMessages(
    messageHandlers: MessageMappingProperty[],
    client: any,
    instance: Gateway,
  ) {
    messageHandlers.map(({ message, callback }: MessageMappingProperty) => {
      client.on(message, callback.bind(instance, client));
    });
  }
}
