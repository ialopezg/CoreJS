import { Controller, ControllerMetadata, MetaType } from '../../common/interfaces';
import { IMiddleware, MiddlewareConfiguration } from './interfaces';
import { RoutesMapper } from './mapper';
import { RequestMethod } from '../../common';

export class MiddlewareContainer {
  private readonly middlewares = new Map<string, Map<string, MiddlewareWrapper>>();
  private readonly configurations = new Map<string, Set<MiddlewareConfiguration>>();

  constructor(private readonly mapper: RoutesMapper) {}

  /**
   * Adds and register configurations for middleware objects.
   *
   * @param {Array<MiddlewareConfiguration>} configurations Configurations to be registered.
   * @param {IModule} parent Parent module.
   */
  public addConfig(configurations: MiddlewareConfiguration[], parent: string): void {
    const middlewares = this.getCurrentMiddlewares(parent);
    const configs = this.getCurrentConfig(parent);

    (configurations ?? []).forEach((configuration) => {
      [].concat(configuration.middlewares).forEach((metaType) => {
        middlewares.set(metaType.name, {
          instance: null,
          metaType,
        });
      });

      configuration.forRoutes = this.mapRoutesToFlatList(configuration.forRoutes);
      configs.add(configuration);
    });
  }

  /**
   * Get the list of middleware already registered.
   */
  public getMiddlewares(parent: string): Map<string, MiddlewareWrapper> {
    return this.middlewares.get(parent) ?? new Map<string, MiddlewareWrapper>();
  }

  /**
   * Gets the list of middleware configurations already registered.
   */
  public getConfigs(): Map<string, Set<MiddlewareConfiguration>> {
    return this.configurations;
  }

  private getCurrentMiddlewares(parent: string): Map<string, MiddlewareWrapper> {
    if (!this.middlewares.has(parent)) {
      this.middlewares.set(parent, new Map<string, MiddlewareWrapper>());
    }

    return this.middlewares.get(parent);
  }

  private getCurrentConfig(parent: string): Set<MiddlewareConfiguration> {
    if (!this.configurations.has(parent)) {
      this.configurations.set(parent, new Set<MiddlewareConfiguration>());
    }

    return this.configurations.get(parent);
  }

  private mapRoutesToFlatList(
    forRoutes: (Controller | ControllerMetadata & { request?: RequestMethod })[],
  ) {
    return forRoutes
      .map((route) => this.mapper.map(route))
      .reduce((a, b) => a.concat(b));
  }
}

/**
 * Middleware instance wrapper.
 */
export interface MiddlewareWrapper {
  /**
   * Middleware instance.
   */
  instance: IMiddleware;
  /**
   * Middleware meta-type information.
   */
  metaType: MetaType<IMiddleware>;
}
