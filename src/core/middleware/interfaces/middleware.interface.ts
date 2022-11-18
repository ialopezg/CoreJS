import { NextFunction, Request, Response } from 'express';

/**
 * Defines a prototype for Gateway objects.
 */
export interface Middleware {
  /**
   * Resolves middleware objects.
   */
  resolve: () => (request?: Request, response?: Response, next?: NextFunction) => void;
}
