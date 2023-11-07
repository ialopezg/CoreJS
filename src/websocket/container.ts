import { ObservableSocketServer, WebSocketServerData } from './interfaces';

/**
 * Subject Server Container.
 */
export class SocketContainer {
  private sockets = new Map<WebSocketServerData, ObservableSocketServer>();

  /**
   * Get the websocket subjects hooked into the given namespace.
   *
   * @param {string} namespace Namespace.
   * @param {number} port Port number.
   *
   * @returns {ObservableSocketServer} The websocket events or null if not exists.
   */
  public get(namespace: string, port: number): ObservableSocketServer {
    return this.sockets.get({ namespace, port });
  }

  /**
   * Register an observable server by given namespace.
   *
   * @param {string} namespace Server namespace.
   * @param {number} port Port number.
   * @param {ObservableSocketServer} server Server object to be registered.
   */
  public register(
    namespace: string,
    port: number,
    server: ObservableSocketServer,
  ) {
    this.sockets.set({ namespace, port }, server);
  }
}
