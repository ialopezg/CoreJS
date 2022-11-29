import { NextFunction, Request, Response } from 'express';

import { ExceptionHandler } from '../exceptions';

/**
 * Represents a router proxy callback.
 */
export interface RouterProxyCallback {
  (request?: Request, response?: Response, next?: NextFunction): void;
}

/**
 * Represents an object that creates router proxies.
 */
export class RouterProxy {
  /**
   * Creates a new instance of this class with given parameters.
   *
   * @param exceptionHandler Exception handler.
   */
  constructor(private readonly exceptionHandler: ExceptionHandler) {
  }

  /**
   * Creates a proxy instance with given callback.
   *
   * @param callback Callback to be used.
   * @returns
   */
  create(callback: RouterProxyCallback): any {
    return (request: Request, response: Response, next: NextFunction) => {
      try {
        Promise
          .resolve(callback(request, response, next))
          .catch((error: any) => {
            this.exceptionHandler.next(error, response);
          });
      } catch (error: any) {
        this.exceptionHandler.next(error, response);
      }
    };
  }
}
