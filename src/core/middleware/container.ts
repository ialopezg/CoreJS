import { IMiddleware, MiddlewareConfiguration } from './builder';

/**
 * Stores middlewares and their configurations.
 */
export class MiddlewareContainer {
  private readonly middlewares: Map<IMiddleware, IMiddleware> = new Map<IMiddleware, IMiddleware>();
  private readonly configurations: MiddlewareConfiguration[] = [];

  /**
   * Add configurations to container.
   *
   * @param {MiddlewareConfiguration[]} configurations Middleware configurations to be added.
   */
  public add(configurations: MiddlewareConfiguration[]): void {
    configurations.forEach((configuration) => {
      (<IMiddleware[]>configuration.middlewares).forEach((middleware) => {
        this.middlewares.set(middleware, null);
      });
      this.configurations.push(configuration);
    });
  }

  /**
   * Return current middleware configurations.
   */
  public getConfigurations(): MiddlewareConfiguration[] {
    return this.configurations.slice(0);
  }

  /**
   * Return registered middlewares.
   */
  public getMiddlewares(): Map<IMiddleware, IMiddleware> {
    return this.middlewares;
  }
}
