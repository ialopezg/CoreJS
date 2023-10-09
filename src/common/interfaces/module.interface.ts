import { MiddlewareBuilder } from '../../core/middleware/builder';

/**
 * Represents a set of code encapsulated to be injected into
 * an application.
 */
export interface IModule {
  /**
   * Middleware configuration resolver.
   *
   * @param {MiddlewareBuilder} router Configurator object.
   */
  configure?: (router: MiddlewareBuilder) => MiddlewareBuilder;
}
