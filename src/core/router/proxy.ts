import { NextFunction, Request, Response } from 'express';

import { ExceptionHandler } from '../exceptions';

/**
 * Represents a proxy callback between to a request method.
 */
export class RouterProxy {
  /**
   * Creates a new instance of the RouterProxy class.
   *
   * @param {ExceptionHandler} errorHandler Error handler.
   */
  constructor(private readonly errorHandler: ExceptionHandler) {}

  /**
   * Creates a router proxy to execute a custom function.
   *
   * @param {(request: Request, response: Response, next: NextFunction) => void} callback Function to execute.
   */
  public createProxy(
    callback: RouterProxyCallback,
  ): (request: Request, response: Response, next: NextFunction) => void {
    return (request: Request, response: Response, next: NextFunction) => {
      try {
        Promise.resolve(callback(request, response, next)).catch((error) => {
          this.errorHandler.next(error, response);
        });
      } catch (error: any) {
        this.errorHandler.next(error, response);
      }
    };
  }
}

/**
 * Represents a router callback function.
 */
export interface RouterProxyCallback {
  /**
   * Callback executor.
   *
   * @param {Request} request Request object.
   * @param {Response} response Response object.
   * @param {NextFunction} next Next function.
   */
  (request?: Request, response?: Response, next?: NextFunction): void;
}
