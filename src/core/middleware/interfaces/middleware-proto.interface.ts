import { Middleware } from './middleware.interface';

/**
 * Defines a prototype for Gateway objects with initialization.
 */
export interface MiddlewareProto {
  /**
   * Creates a new instance of a middleware.
   */
  new(): Middleware;
}
