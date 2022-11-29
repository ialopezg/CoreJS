import { Namespace, Server } from 'socket.io';
import { validatePath } from '../common';
import { SocketAdapter } from './adapters';
import { SocketsContainer } from './sockets.container';
import { ObservableSocketServer } from './interfaces';
import { ObservableSocket } from './observable-socket';

/**
 * Defines an object that provides ObservableSocketServer instances.
 */
export class SocketServerProvider {
  constructor(private readonly container: SocketsContainer) {}

  /**
   * Scans if an ObservableSocketServer exists for given namespace and port.
   *
   * @param namespace Server namespace.
   * @param port Server port.
   *
   * @returns An instance of ObservableSocketServer object.
   */
  scanForSocketServer(namespace: string, port: number): ObservableSocketServer {
    const observableServer = this.container.getSocketServer(namespace, port);

    return observableServer || this.createSocketServer(namespace, port);
  }

  /**
   * Creates an ObservableSocketServer instance with given namespace and port number.
   *
   * @param namespace Server namespace.
   * @param port Server port.
   *
   * @returns An ObservableSocketServer instance with given parameters.
   */
  private createSocketServer(namespace: string, port: number): ObservableSocketServer {
    const server = this.getServerOfNamespace(namespace, port);
    const observableSocket = ObservableSocket.create(server);

    this.container.setSocketServer(namespace, port, observableSocket);

    return observableSocket;
  }

  /**
   * Creates a Socket Server instance with given namespace and port number.
   *
   * @param namespace Namespace to be analyzed.
   * @param port Server port.
   *
   * @returns A Socket Server instance.
   */
  private getServerOfNamespace(namespace: string, port: number): Server | Namespace {
    if (namespace) {
      return SocketAdapter.createWithNamespace(this.validateNamespace(namespace), port);
    }

    return SocketAdapter.create(port);
  }

  /**
   * Validate a namespace.
   *
   * @param namespace Namespace to be evaluated.
   *
   * @returns A normalized namespace.
   */
  private validateNamespace(namespace: string): string {
    return validatePath(namespace);
  }
}
