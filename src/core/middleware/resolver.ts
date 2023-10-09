import { IModule } from '../../common';
import { Injector, ModuleDependencies } from '../injector';
import { MiddlewareContainer } from './container';

/**
 * Resolves middleware instances.
 */
export class MiddlewareResolver {
  private injector = new Injector();
  /**
   * Creates a new instance of the MiddlewareResolver class.
   *
   * @param {MiddlewareContainer} container Middleware container.
   */
  constructor(private readonly container: MiddlewareContainer) {}

  /**
   * Resolves middleware instances.
   *
   * @param {ModuleDependencies} parent Parent
   * @param {IModule} module Module prototype.
   */
  public resolve(parent: ModuleDependencies, module: IModule) {
    const middlewares = this.container.getMiddlewares(module);

    middlewares.forEach((_instance, prototype) => {
      this.injector.loadInstanceOfMiddleware(
        prototype,
        middlewares,
        parent,
      );
    });
  }
}
