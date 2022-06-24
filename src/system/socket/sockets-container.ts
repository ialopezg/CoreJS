import { ReplaySubject, Subject } from 'rxjs';

export class SocketContainer {
  private readonly IOSubjects = new Map<string, SocketEventInterface>();

  getSocketSubject(namespace: string): SocketEventInterface {
    return this.IOSubjects.get(namespace);
  }

  setSocketSubject(
    namespace: string,
    observableServer: SocketEventInterface,
  ): void {
    this.IOSubjects.set(namespace, observableServer);
  }
}

export interface SocketEventInterface {
  server: any;
  init: ReplaySubject<any>;
  connection: Subject<any>;
}
