import { SocketContainer } from './container';
import { ObservableSocketServer } from './interfaces';
import { SocketIOAdapter } from './adapters';
import { Namespace, Server } from 'socket.io';
import { ObservableSocket } from './observable-socket';

/**
 * Represents an object that provides ObservableSocketServer instances.
 */
export class SocketServerProvider {
  constructor(private readonly container: SocketContainer) {}

  /**
   * Look for an ObservableSocketServer by given namespace and port.
   *
   * @param {string} namespace Server namespace.
   * @param {number} port Server port.
   *
   * @returns An instance of ObservableSocketServer object.
   */
  public scanForSocketServer(namespace: string, port: number): ObservableSocketServer {
    let server = this.container.get(namespace, port);
    if (!server) {
      server = this.createServer(namespace, port);
    }

    return server;
  }

  private createServer(namespace: string, port: number): ObservableSocketServer {
    const server = this.getServerOfNamespace(namespace, port);
    const socket = ObservableSocket.create(server);

    this.container.register(namespace, port, socket);

    return socket;
  }

  private getServerOfNamespace(namespace: string, port: number): Server | Namespace {
    if (namespace) {
      return SocketIOAdapter.createWithNamespace(port, this.validateNamespace(namespace));
    }

    return SocketIOAdapter.create(port);
  }

  private validateNamespace(namespace: string): string {
    if (namespace.charAt(0) !== '/') {
      return '/' + namespace;
    }
    return namespace;
  }
}
