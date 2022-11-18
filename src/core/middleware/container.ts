import { Controller, MetaType } from '../../common/interfaces';
import { AppMiddleware, MiddlewareConfiguration } from './interfaces';
import { RoutesMapper } from './mapper';

/**
 * Defines a prototype for Middleware wrapper objects.
 */
export interface MiddlewareWrapper {
  /**
   * Middleware instance.
   */
  instance: AppMiddleware;

  /**
   * Middleware MetaType.
   */
  metaType: MetaType<AppMiddleware>;
}

/**
 * Represents a container for middleware configurations.
 */
export class MiddlewareContainer {
  private readonly middlewares = new Map<string, Map<string, MiddlewareWrapper>>();
  private readonly configs = new Map<string, Set<MiddlewareConfiguration>>();

  /**
   * Creates a new instance of this class with given parameters.
   *
   * @param mapper RoutesMapper object.
   */
  constructor(private readonly mapper: RoutesMapper) { }

  /**
   * Add a configuration to current middlewares configuration.
   *
   * @param configList Configuration to be added.
   * @param moduleName Module that contains the configuration to be added.
   */
  addConfig(configList: MiddlewareConfiguration[], moduleName: string): void {
    const middlewares = this.getCurrentMiddlewares(moduleName);
    const configs = this.getCurrentConfigs(moduleName) || new Set<MiddlewareConfiguration>();

    (configList || []).forEach((config: MiddlewareConfiguration) => {
      [].concat(config.middlewares).forEach((metaType: any) => {
        middlewares.set(metaType.name, {
          instance: null,
          metaType,
        });
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
  getConfigs(): Map<string, Set<MiddlewareConfiguration>> {
    return this.configs;
  }

  /**
   * Gets the collection of Middlewares for given module name.
   *
   * @param module Module name.
   * @returns A collection of Middlewares.
   */
  getMiddlewares(module: string): Map<string, MiddlewareWrapper> {
    return this.middlewares.get(module) || new Map();
  }

  /**
   * Get current middlewares for given module.
   *
   * @param moduleName Module to be analyzed.
   *
   * @returns The middleware list.
   */
  private getCurrentMiddlewares(moduleName: string): Map<string, MiddlewareWrapper> {
    if (!this.middlewares.has(moduleName)) {
      this.middlewares.set(moduleName, new Map<string, MiddlewareWrapper>());
    }

    return this.middlewares.get(moduleName);
  }

  /**
  * Get current configuration list for given module.
  *
  * @param module Module to be analyzed.
  *
  * @returns The configuration list.
  */
  private getCurrentConfigs(module: string): Set<MiddlewareConfiguration> {
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
