import { Observable, Observer } from 'rxjs';

/**
 * Represents a Client Proxy that can interchange messages and data.
 */
export abstract class ClientProxy {
  /**
   * Sends a single message.
   *
   * @param pattern Message pattern.
   * @param {Function} callback Callback to be executed after send the message.
   */
  abstract sendSingleMessage(pattern: any, callback: Function);

  /**
   * Sends message patterns.
   *
   * @param pattern Message pattern.
   * @param data Message data.
   */
  public send<T>(pattern: any, data: any): Observable<T> {
    return new Observable<T>((observer: Observer<T>) => {
      this.sendSingleMessage(
        { pattern, data },
        this.createObserver<T>(observer),
      );
    });
  }

  private createObserver<T>(observer: Observer<T>): Function {
    return (error, result) => {
      if (error) {
        return observer.error(error);
      }

      observer.next(result);
      observer.complete();
    }
  }
}
