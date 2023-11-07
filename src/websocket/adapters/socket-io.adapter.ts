import { Namespace, Server } from 'socket.io';

/**
 * Socket.IO server adapter.
 */
export class SocketIOAdapter {
  /**
   * Creates a new instance of Socket.IO server.
   *
   * @param {number} port Server port.
   */
  static create(port: number): Server {
    return new Server(port);
  }

  /**
   * Creates a new instance of Socket.IO server with given namespace.
   *
   * @param {number} port Server port.
   * @param {string} namespace Server namespace.
   */
  static createWithNamespace(
    port: number,
    namespace: string,
  ): Namespace {
    return this.create(port).of(namespace);
  }
}
