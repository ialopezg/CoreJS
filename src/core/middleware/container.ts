import { AppModule } from '../../common';
import { Controller } from '../../common/interfaces';
import { UnknownModuleException } from '../../errors/exceptions';
import { Middleware, MiddlewareConfiguration } from './interfaces';
import { MiddlewareProto } from './interfaces/middleware-proto.interface';
import { RoutesMapper } from './mapper';

/**
 * Represents a container for middleware configurations.
 */
export class MiddlewareContainer {
  private readonly middlewares = new Map<AppModule, Map<MiddlewareProto, Middleware>>();
  private readonly configs = new Map<AppModule, Set<MiddlewareConfiguration>>();

  /**
   * Creates a new instance of this class with given parameters.
   *
   * @param mapper RoutesMapper object.
   */
  constructor(private readonly mapper: RoutesMapper) {}

  /**
   * Add a configuration to current middlewares configuration.
   *
   * @param configList Configuration to be added.
   * @param module Module that contains the configuration to be added.
   */
  addConfig(configList: MiddlewareConfiguration[], module: AppModule | any): void {
    const middlewares = this.getCurrentMiddlewares(module);
    const configs = this.getCurrentConfigs(module);

    (configList || []).forEach((config: MiddlewareConfiguration) => {
      [].concat(config.middlewares).forEach((middleware: any) => {
        middlewares.set(middleware, null);
      });

      config.forRoutes = this.mapControllersToFlatList(config.forRoutes);
      configs.add(config);
    });
  }

  /**
   * Gets the collection of MiddlewareConfiguration for given module.
   *
   * @returns A collection of MiddlewareConfiguration.
   */
  getConfigs(): Map<AppModule, Set<MiddlewareConfiguration>> {
    return this.configs;
  }

  /**
   * Gets the collection of Middlewares for given module.
   *
   * @returns A collection of Middlewares.
   */
  getMiddlewares(module: AppModule): Map<MiddlewareProto, Middleware> {
    return this.middlewares.get(module) || new Map();
  }

  /**
   * Get current middlewares for given module.
   *
   * @param module Module to be analyzed.
   *
   * @returns The middleware list.
   */
  private getCurrentMiddlewares(module: AppModule): Map<MiddlewareProto, Middleware> {
    if (!this.middlewares.has(module)) {
      this.middlewares.set(module, new Map<MiddlewareProto, Middleware>());
    }

    return this.middlewares.get(module);
  }

  /**
   * Get current configuration list for given module.
   *
   * @param module Module to be analyzed.
   *
   * @returns The configuration list.
   */
  private getCurrentConfigs(module: AppModule): Set<MiddlewareConfiguration> {
    if (!this.configs.has(module)) {
      this.configs.set(module, new Set<MiddlewareConfiguration>());
    }

    return this.configs.get(module);
  }

  /**
   * Maps a Controller collection to middleware properties.
   *
   * @param controllers Controller collection to be mapped.
   *
   * @returns A collection containing route properties.
   */
  private mapControllersToFlatList(controllers: Controller[]): any {
    return controllers.map((controller: Controller) => (
      this.mapper.mapControllerToControllerMetadata(controller)
    )).reduce((a: any, b: any) => a.concat(b));
  }
}
