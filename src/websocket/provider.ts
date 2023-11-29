import { SocketContainer } from './container';
import { ObservableSocketServer } from './interfaces';
import { SocketIOAdapter } from './adapters';
import { Namespace, Server } from 'socket.io';
import { ObservableSocket } from './observable-socket';
import { validatePath } from '../common';

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
  public scan(namespace: string, port: number): ObservableSocketServer {
    const server = this.container.get(namespace, port);

    return server ? server : this.create(namespace, port);
  }

  private create(namespace: string, port: number): ObservableSocketServer {
    const server = this.getServerOfNamespace(namespace, port);
    const socket = ObservableSocket.create(server);

    this.container.register(namespace, port, socket);

    return socket;
  }

  private getServerOfNamespace(
    namespace: string,
    port: number,
  ): Server | Namespace {
    if (namespace) {
      return SocketIOAdapter.createWithNamespace(
        port,
        this.validateNamespace(namespace),
      );
    }

    return SocketIOAdapter.create(port);
  }

  private validateNamespace(namespace: string): string {
    return validatePath(namespace);
  }
}
