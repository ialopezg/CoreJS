import { Namespace, Server } from 'socket.io';
import { ReplaySubject, Subject } from 'rxjs';

/**
 * Subject Server Container.
 */
export class SocketsContainer {
  private sockets: Map<string, SocketEvents> = new Map<string, SocketEvents>();

  /**
   * Get the socket subjects hooked into the given namespace.
   *
   * @param {string} namespace Namespace to scan.
   *
   * @returns {SocketEvents} The socket events or null if not exists.
   */
  public get(namespace: string): SocketEvents {
    return this.sockets.get(namespace);
  }

  /**
   * Register an observable server by given namespace.
   *
   * @param {string} namespace Server namespace.
   * @param {SocketEvents} server Server object to be registered.
   */
  public register(namespace: string, server: SocketEvents) {
    this.sockets.set(namespace, server);
  }
}

/**
 * Represents an Observable Server
 */
export interface SocketEvents {
  /**
   * Server object definition.
   */
  server: Namespace | Server;
  /**
   * Init event.
   */
  init: ReplaySubject<any>;
  /**
   * Connection event.
   */
  connection: Subject<any>;
}
