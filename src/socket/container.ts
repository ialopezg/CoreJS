import { ObservableSocketServer, SocketServerData } from './interfaces';

/**
 * Subject Server Container.
 */
export class SocketContainer {
  private subjects = new Map<SocketServerData, ObservableSocketServer>();

  /**
   * Get the socket subjects hooked into the given namespace.
   *
   * @param {string} namespace Namespace.
   * @param {number} port Port number.
   *
   * @returns {ObservableSocketServer} The socket events or null if not exists.
   */
  public get(
    namespace: string,
    port: number,
  ): ObservableSocketServer {
    return this.subjects.get({ namespace, port });
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
    this.subjects.set({ namespace, port }, server);
  }
}
