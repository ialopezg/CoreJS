import { Namespace, Server } from 'socket.io';
import { ObservableSocketServer, SocketServerData } from './interfaces';

/**
 * Defines a container for ObservableSocketServer objects.
 */
export class SocketContainer {
  private readonly subjects = new Map<SocketServerData, ObservableSocketServer>();

  /**
   * Get the ObservableSocketServer object with given namespace and port.
   *
   * @param namespace Server namespace.
   * @param port Server port.
   *
   * @returns An instance of ObservableSocketServer object.
   */
  getSocketSubjects(namespace: string, port: number): ObservableSocketServer {
    return this.subjects.get({ namespace, port });
  }

  /**
   * Stores an ObservableSocketServer in the current collection.
   *
   * @param namespace Server namespace.
   * @param port Server port
   * @param server ObservableSocketServer instance.
   */
  setSocketSubjects(namespace: string, port: number, server: ObservableSocketServer): void {
    this.subjects.set({ namespace, port }, server);
  }
}
