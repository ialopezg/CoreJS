import { ObservableSocketServer, WebSocketServerData } from './interfaces';

/**
 * Defines a container for Observable SocketServer objects.
 */
export class SocketsContainer {
  private readonly socketServers = new Map<WebSocketServerData, ObservableSocketServer>();

  /**
   * Get the Observable SocketServer object with given namespace and port.
   *
   * @param namespace Server namespace.
   * @param port Server port.
   *
   * @returns An instance of Observable SocketServer object.
   */
  getSocketServer(namespace: string, port: number): ObservableSocketServer {
    return this.socketServers.get({
      namespace,
      port,
    });
  }

  /**
   * Stores an Observable SocketServer in the current collection.
   *
   * @param namespace Server namespace.
   * @param port Server port
   * @param server ObservableSocketServer instance.
   */
  setSocketServer(namespace: string, port: number, server: ObservableSocketServer): void {
    this.socketServers.set({
      namespace,
      port,
    }, server);
  }
}
