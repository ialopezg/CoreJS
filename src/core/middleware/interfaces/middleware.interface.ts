import { NextFunction, Request, Response } from 'express';

/**
 * Represents a middleware object.
 */
export interface IMiddleware {
  /**
   * Middleware configuration resolver.
   */
  resolve(...args: any[]): (request?: Request, response?: Response, next?: NextFunction) => void;
}
