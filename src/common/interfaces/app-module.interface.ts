import { MiddlewareBuilder } from '../../core';

/**
 * Defines a prototype for App Module objects.
 */
export interface AppModule {
  configure?: (router: MiddlewareBuilder) => MiddlewareBuilder;
}
