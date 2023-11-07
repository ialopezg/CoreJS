import { ReplaySubject, Subject } from 'rxjs';
import { Namespace, Server } from 'socket.io';

/**
 * Defines a prototype for an Observable Socket Server.
 */
export interface ObservableSocketServer {
  /**
   * Server object.
   */
  server: Server | Namespace;
  /**
   * Init event.
   */
  init: ReplaySubject<any>;
  /**
   * Connection event.
   */
  connection: Subject<any>;
  /**
   * Disconnect event.
   */
  disconnect: Subject<any>;
}
