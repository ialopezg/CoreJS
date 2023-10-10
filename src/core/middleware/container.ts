import { IController, ControllerMetadata, IModule } from '../../common/interfaces';
import { IMiddleware, MiddlewareConfiguration, IMiddlewareProto } from './interfaces';
import { RoutesMapper } from './mapper';
import { RequestMethod } from '../../common';

export class MiddlewareContainer {
  private readonly middlewares = new Map<IModule, Map<IMiddlewareProto, IMiddleware>>();
  private readonly configs = new Map<IModule, Set<MiddlewareConfiguration>>;

  constructor(private readonly mapper: RoutesMapper) {}

  /**
   * Adds and register configurations for middleware objects.
   *
   * @param {Array<MiddlewareConfiguration>} configurations Configurations to be registered.
   * @param {IModule} parent Parent module.
   */
  public addConfig(configurations: MiddlewareConfiguration[], parent: IModule): void {
    const middlewares = this.getCurrentMiddlewares(parent);
    const configs = this.getCurrentConfig(parent);

    (configurations ?? []).map((configuration) => {
      [].concat(configuration.middlewares).map((middleware) => {
        middlewares.set(middleware, null);
      });

      configuration.forRoutes = this.mapRoutesToFlatList(configuration.forRoutes);
      configs.add(configuration);
    });
  }

  /**
   * Get the list of middleware already registered.
   */
  public getMiddlewares(parent: IModule): Map<IMiddlewareProto, IMiddleware> {
    return this.middlewares.get(parent) ?? new Map<IMiddlewareProto, IMiddleware>();
  }

  /**
   * Gets the list of middleware configurations already registered.
   */
  public getConfigs(): Map<IModule, Set<MiddlewareConfiguration>> {
    return this.configs;
  }

  private getCurrentMiddlewares(parent: IModule): Map<IMiddlewareProto, IMiddleware> {
    if (!this.middlewares.has(parent)) {
      this.middlewares.set(parent, new Map<IMiddlewareProto, IMiddleware>());
    }

    return this.middlewares.get(parent);
  }

  private getCurrentConfig(parent: IModule): Set<MiddlewareConfiguration> {
    if (!this.configs.has(parent)) {
      this.configs.set(parent, new Set<MiddlewareConfiguration>());
    }

    return this.configs.get(parent);
  }

  private mapRoutesToFlatList(forRoutes: (IController | ControllerMetadata & { request?: RequestMethod })[]) {
    return forRoutes
      .map((route) => this.mapper.map(route))
      .reduce((a, b) => a.concat(b));
  }
}
