import 'reflect-metadata';

import { ReplaySubject, Subject } from 'rxjs';
import { Namespace, Server } from 'socket.io';

import { IComponent } from '../core/interfaces';
import { SocketsContainer, SocketEvents } from './container';
import { IGateway } from './interfaces';

/**
 * Observable Socket Servers Controller
 */
export class SubjectsController {
  /**
   * Creates a new instance of SubjectsController class.
   *
   * @param {SocketsContainer} container Container for sockets.
   * @param {Server} server Observable Socket Server.
   */
  constructor(
    private readonly container: SocketsContainer,
    private readonly server: Server,
  ) {}

  /**
   * Register a gateway service into the socket module.
   *
   * @param {IGateway} target Gateway service to be registered.
   * @param {IComponent} prototype Component that contains the gateway service.
   */
  public hook(target: IGateway, prototype: IComponent) {
    const namespace = Reflect.getMetadata('namespace', prototype) || '';
    const observableServer = this.scan(namespace);

    const { init, connection } = observableServer;
    init.subscribe(target.onInit.bind(target));
    connection.subscribe(target.connection?.bind(target));
  }

  private scan(namespace: string): SocketEvents {
    let observableServer: SocketEvents = this.container.get(namespace);
    if (!observableServer) {
      observableServer = this.create(namespace);
    }

    return observableServer;
  }

  private create(namespace: string): SocketEvents {
    const server = this.getByNamespace(namespace);
    const observableServer = {
      server,
      init: new ReplaySubject(),
      connection: new Subject(),
    };

    const { init, connection } = observableServer;
    init.next(server);

    server.on('connection', (client: any) => {
      connection.next(client);
    });

    this.container.register(namespace, observableServer);

    return observableServer;
  }

  private getByNamespace(namespace: string): Namespace | Server {
    if (namespace) {
      return this.server.of(this.validateNamespace(namespace));
    }

    return this.server;
  }

  private validateNamespace(namespace: string): string {
    if (namespace.charAt(0) !== '/') {
      return `/${namespace}`;
    }

    return namespace;
  }
}
