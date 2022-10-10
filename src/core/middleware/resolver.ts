import { AppModule } from '../../common';
import { Injector, ModuleDependency } from '../injector';
import { MiddlewareContainer } from './container';
import { Middleware, MiddlewareProto } from './interfaces';

/**
 * Represents an object that resolve middleware instances.
 */
export class MiddlewareResolver {
  private readonly injector = new Injector();

  /**
   * Creates a new instance of this app with given parameters.
   *
   * @param container Middleware container.
   */
  constructor(private readonly container: MiddlewareContainer) {}

  /**
   * Resolve a middleware instance for given module.
   *
   * @param module Module that contains the middleware configuration.
   * @param prototype Middleware prototype to be resolved.
   */
  resolveInstances(module: ModuleDependency, prototype: AppModule) {
    const middlewares = this.container.getMiddlewares(prototype);

    middlewares.forEach((middleware: Middleware, prototype: MiddlewareProto) => {
      this.injector.loadInstanceOfMiddleware(prototype, middlewares, module);
    });
  }
}
