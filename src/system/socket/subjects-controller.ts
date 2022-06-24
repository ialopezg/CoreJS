import 'reflect-metadata';

import { ReplaySubject, Subject } from 'rxjs';
import { Namespace, Server } from 'socket.io';

import { SocketContainer, SocketEventInterface } from './sockets-container';
import { Gateway } from './interfaces';
import { Component } from '../core/interfaces';
import { validatePath } from '../../common';

export class SubjectsController {
  constructor(
    private readonly container: SocketContainer,
    private readonly server: Server,
  ) {}

  hookGatewayIntoSocket(instance: Gateway, component: Component) {
    const namespace = Reflect.getMetadata('namespace', component) || '';
    const observableServer = this.scanForSocketServer(namespace);

    const { init, connection } = observableServer;

    init.subscribe(instance.onInit.bind(instance));
    connection.subscribe(instance.connection.bind(instance));
  }

  private scanForSocketServer(namespace: string): SocketEventInterface {
    let observableServer = this.container.getSocketSubject(namespace);

    if (!observableServer) {
      observableServer = this.createObservableServer(namespace);
    }

    return observableServer;
  }

  private createObservableServer(namespace: string): SocketEventInterface {
    const server = this.getServerOfNamespace(namespace);
    const observableServer = {
      init: new ReplaySubject(),
      connection: new Subject(),
      server,
    };

    const { init, connection } = observableServer;
    init.next(server);

    server.on('connection', (client: any) => {
      connection.next(client);
    });

    this.container.setSocketSubject(namespace, observableServer);

    return observableServer;
  }

  private getServerOfNamespace(namespace: string): Server | Namespace {
    if (namespace) {
      return this.server.of(SubjectsController.validateNamespace(namespace));
    }

    return this.server;
  }

  private static validateNamespace(namespace: string): string {
    return validatePath(namespace);
  }
}
