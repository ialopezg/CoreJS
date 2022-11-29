import { ReplaySubject, Subject } from 'rxjs';
import { Namespace, Server } from 'socket.io';

import { ObservableSocketServer } from './interfaces';

/**
 * Defines a Observable Socket object.
 */
export class ObservableSocket {
  /**
   * Creates an ObservableSocketServer instance.
   *
   * @param server Object server to be binded.
   *
   * @returns An ObservableSocketServer instance.
   */
  static create(server: Server | Namespace): ObservableSocketServer {
    return {
      init: new ReplaySubject(),
      connection: new Subject(),
      disconnect: new Subject(),
      server,
    };
  }
}
