import { Namespace, Server } from 'socket.io';
import { SocketIOAdapter } from './adapters';
import { SocketContainer } from './container';
import { ObservableSocketServer } from './interfaces';
import { ObservableSocket } from './observable-socket';

/**
 * Defines an object that provides ObservableSocketServer instances.
 */
export class SocketServerProvider {
  constructor(private readonly container: SocketContainer) {}

  /**
   * Scans if an ObservaSocketServer exists for given namespace and port.
   *
   * @param namespace Server namespace.
   * @param port Server port.
   *
   * @returns An instance of ObservableSocketServer object.
   */
  scanForSocketServer(namespace: string, port: number): ObservableSocketServer {
    let observableServer = this.container.getSocketSubjects(namespace, port);

    if (!observableServer) {
      observableServer = this.createSocketServer(namespace, port);
    }

    return observableServer;
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

    this.container.setSocketSubjects(namespace, port, observableSocket);

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
      return SocketIOAdapter.createWithNamespace(this.validateNamespace(namespace), port);
    }

    return SocketIOAdapter.create(port);
  }

  /**
   * Validate a namescpace.
   *
   * @param namespace Namespace to be evaluated.
   *
   * @returns A normalized namespace.
   */
  private validateNamespace(namespace: string): string {
    return namespace.charAt(0) !== '/' ? `/${namespace}` : namespace
  }
}
