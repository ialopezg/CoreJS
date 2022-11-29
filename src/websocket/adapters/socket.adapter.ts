import { Namespace, Server } from 'socket.io';

/**
 * Defines an object that creates Socket Server instances.
 */
export class SocketAdapter {
  /**
   * Creates a Socket Server instance with given port number.
   *
   * @param port Server port.
   *
   * @returns An instance of Socket Server.
   */
  static create(port: number): Server {
    return new Server(port);
  }

  /**
   * Creates a Socket Server instance with given namespace and port number.
   *
   * @param port Server port.
   *
   * @returns An instance of Socket Server.
   */
  static createWithNamespace(namespace: string, port: number): Namespace {
    return this.create(port).of(namespace);
  }
}
