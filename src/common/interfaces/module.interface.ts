import { MiddlewareBuilder } from '../../core';

/**
 * Defines a prototype for App Module objects.
 */
export interface Module {
  /**
   * Middleware configurator method.
   */
  configure?: (router: MiddlewareBuilder) => MiddlewareBuilder;
}
