import { Observable, Observer } from 'rxjs';

/**
 * Client proxy.
 */
export abstract class ProxyClient {
  /**
   * Send a single message.
   *
   * @param pattern Message pattern.
   * @param callback Callback to be executed.
   */
  abstract sendSingleMessage(pattern: any, callback: Function): void;

  /**
   * Sends message patterns and process attached actions.
   *
   * @param pattern Message pattern.
   * @param data Data to be processed.
   *
   * @returns An observable and streamable object.
   */
  send<T>(pattern: any, data: any): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      this.sendSingleMessage({
        pattern,
        data,
      }, this.createObserver(observer));
    });
  }

  /**
   * Creates an observer to be used when a single message will be sent.
   *
   * @param observer Object reference to be used.
   *
   * @returns An observer callback.
   */
  createObserver<T>(observer: Observer<T>) {
    return (error, result) => {
      if (error) {
        (<any>observer).error(error);

        return;
      }

      observer.next(result);
      observer.complete();
    };
  }
}
