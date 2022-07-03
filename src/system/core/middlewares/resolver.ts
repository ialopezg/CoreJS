import { AppContainer, InstanceWrapper, ModuleDependency } from '../container';
import { Controller, ControllerMetadata } from '../interfaces';
import { AppInstanceLoader } from '../instance-loader';
import { Middleware } from './builder';
import { MiddlewareContainer } from './container';

/**
 * Middlewares Configuration Resolver.
 */
export class MiddlewaresResolver {
  private readonly loader = new AppInstanceLoader();

  /**
   * Creates a new instance of MiddlewaresResolver class.
   *
   * @param middlewares Middlewares container.
   * @param modules Modules container.
   */
  constructor(
    private readonly middlewares: MiddlewareContainer,
    private readonly modules: AppContainer,
  ) {}

  /**
   * Resolve middlewares intances in parent module.
   *
   * @param parent Parent module.
   */
  resolveInstance(parent: ModuleDependency): void {
    const middlewares = this.middlewares.getMiddlewares();

    middlewares.forEach((_value: Middleware, middleware: Middleware) => {
      this.loader.loadInstanceOfMiddleware(middleware, middlewares, parent);
    });
  }
}

/**
 * Middleware Dependency
 */
export interface MiddlewareDependencies extends InstanceWrapper<Middleware> {
  forRoutes: (Controller | ControllerMetadata)[];
}
