import { MiddlewareContainer } from './container';
import { IModuleDependencies, ModuleContainer } from '../container';
import { InstanceLoader } from '../loader';

/**
 * Middleware instance resolver.
 */
export class MiddlewareResolver {
  private readonly loader = new InstanceLoader();

  /**
   * Creates a new instance of MiddlewareResolver class.
   *
   * @param {MiddlewareContainer} middlewareContainer Middleware container.
   * @param {ModuleContainer} moduleContainer Module container.
   */
  constructor(
    private readonly middlewareContainer: MiddlewareContainer,
    private readonly moduleContainer: ModuleContainer,
  ) {}

  /**
   * Resolve a middleware instance.
   * @param target
   */
  public resolve(target: IModuleDependencies): void {
    const middlewares = this.middlewareContainer.getMiddlewares();

    middlewares.forEach((_, middleware) => {
      this.loader.loadMiddlewareInstance(middleware, middlewares, target);
    });
  }
}
