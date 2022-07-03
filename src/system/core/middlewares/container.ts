import { MiddlewareConfiguration, Middleware } from './builder';
import { InstanceWrapper } from '../container';
import { Controller, ControllerMetadata } from '../interfaces';

/**
 * Middleware Store Container.
 */
export class MiddlewareContainer {
  private readonly middlewares = new Map<Middleware, Middleware>();
  private readonly configs: MiddlewareConfiguration[] = [];

  /**
   * Stores given middleware configuration.
   *
   * @param configList Middleware Configuration.
   */
  addConfig(configList: MiddlewareConfiguration[]): void {
    configList.map((config: MiddlewareConfiguration) => {
      (<Middleware[]>config.middlewares).map((middleware: Middleware) => {
        this.middlewares.set(middleware, null);
      });
      this.configs.push(config);
    });
  }

  /**
   * Get current configuration list.
   *
   * @returns The current configuration list.
   */
  getConfigs(): MiddlewareConfiguration[] {
    return this.configs.slice(0);
  }

  /**
   * Get current Middleware list.
   *
   * @returns The current Middleware list.
   */
  getMiddlewares(): Map<Middleware, Middleware> {
    return this.middlewares;
  }
}

/**
 * Middleware Dependency object.
 */
export interface MiddlewareDependency extends InstanceWrapper<Middleware> {
  /**
   * Routes where middleware configuration will be applied.
   */
  forRoutes: (Controller | ControllerMetadata)[];
}
