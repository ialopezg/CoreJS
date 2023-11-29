import { Injector, Module } from '../injector';
import { MiddlewareContainer, MiddlewareWrapper } from './container';

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
   * @param {Module} parent Parent
   * @param {string} parentName Module prototype.
   */
  public resolve(parent: Module, parentName: string): void {
    const middlewares = this.container.getMiddlewares(parentName);

    middlewares.forEach((wrapper) => {
      this.resolveMiddlewareInstance(wrapper, middlewares, parent);
    });
  }

  private resolveMiddlewareInstance(
    wrapper: MiddlewareWrapper,
    middlewares: Map<string, MiddlewareWrapper>,
    parent: Module,
  ): void {
    this.injector.loadInstanceOfMiddleware(wrapper, middlewares, parent);
  }
}
