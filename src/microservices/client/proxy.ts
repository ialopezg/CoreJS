import { isNil } from '@ialopezg/commonjs';
import { Observable, Observer, throwError } from 'rxjs';

import { InvalidMessageException } from '../exceptions';

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
  abstract sendSingleMessage(pattern: any, callback: Function): void;

  /**
   * Sends message patterns.
   *
   * @param pattern Message pattern.
   * @param data Message data.
   */
  public send<T>(pattern: any, data: any): Observable<T> {
    if (isNil(pattern) || isNil(data)) {
      return throwError(() => new InvalidMessageException());
    }

    return new Observable<T>((observer: Observer<T>) => {
      this.sendSingleMessage(
        { pattern, data },
        this.createObserver<T>(observer),
      );
    });
  }

  private createObserver<T>(observer: Observer<T>): Function {
    return (error: any, result: any) => {
      if (error) {
        return observer.error(error);
      }

      observer.next(result);
      observer.complete();
    }
  }
}
