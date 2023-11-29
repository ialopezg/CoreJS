import { NextFunction, Request, Response } from 'express';

/**
 * Represents a middleware object.
 */
export interface IMiddleware {
  /**
   * Middleware configuration resolver.
   */
  resolve: () => (request?: Request, response?: Response, next?: NextFunction) => void;
}
