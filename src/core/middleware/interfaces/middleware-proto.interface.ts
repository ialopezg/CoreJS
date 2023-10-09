import { IMiddleware } from './middleware.interface';

/**
 * Takes a set of parameters and returns a middleware object type.
 */
export interface IMiddlewareProto {
  /**
   * Entry point.
   */
  new(): IMiddleware;
}
