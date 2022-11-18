import { NextFunction, Request, Response } from 'express';

/**
 * Defines a prototype for Gateway objects.
 */
export interface AppMiddleware {
  /**
   * Resolver method for middlewares.
   */
  resolve: () => (request: Request, response: Response, next: NextFunction) => void;
}
