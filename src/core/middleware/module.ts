import { Application } from 'express';

import { AppModule, RequestMethod } from '../../common';
import { ControllerMetadata } from '../../common/interfaces';
import { InvalidMiddlewareException, UnknownMiddlewareException } from '../../errors/exceptions';
import { AppContainer, ModuleDependency } from '../injector';
import { MiddlewareBuilder } from './builder';
import { MiddlewareContainer } from './container';
import { MiddlewareConfiguration } from './interfaces';
import { RoutesMapper } from './mapper';
import { MiddlewareResolver } from './resolver';

/**
 * Represents an object that injects middlewares into module instances.
 */
export class MiddlewareModule {
  private static readonly container = new MiddlewareContainer(new RoutesMapper());
  private static resolver: MiddlewareResolver;

  /**
   * Gets the current container object.
   *
   * @returns A MiddlewareContainer object
   */
  static getContainer(): MiddlewareContainer {
    return this.container;
  }

  /**
   * Setup all available middlewares for given container modules.
   *
   * @param container Modules container.
   */
  static setup(container: AppContainer): void {
    this.resolver = new MiddlewareResolver(this.container);

    this.resolveMiddlewares(container.getModules());
  }

  /**
   * Setup all controller middlewares.
   *
   * @param application Express application to be used.
   */
  static setupMiddlewares(application: Application): void {
    const configs = this.container.getConfigs();

    configs.forEach((moduleConfig: Set<MiddlewareConfiguration>, module: AppModule) => {
      [...moduleConfig].forEach((config: MiddlewareConfiguration) => {
        config.forRoutes.forEach((controller: ControllerMetadata & { method?: RequestMethod }) => {
          this.setupControllerMiddleware(controller, config, module, application);
        });
      });
    });
  }

  /**
   * Set up a controller for its middlewares.
   *
   * @param controller Controller to be setup.
   * @param config Middleware configuration to be applied.
   * @param module Module that contains the Controller.
   * @param application Express application to be used.
   */
  static setupControllerMiddleware(
    controller: ControllerMetadata & { method?: RequestMethod },
    config: MiddlewareConfiguration,
    module: AppModule,
    application: Application,
  ): void {
    const { path, method } = controller;

    [].concat(config.middlewares).forEach((target: any) => {
      const middlewares = this.container.getMiddlewares(module);
      const middleware = middlewares.get(target);

      if (typeof middleware === 'undefined') {
        throw new UnknownMiddlewareException();
      }

      if (typeof middleware.resolve === 'undefined') {
        throw new InvalidMiddlewareException();
      }

      const router = this.findRouterMethod(application, method).bind(application);
      router(path, middleware.resolve());
    });
  }

  /**
   * Gets the callback for HTTP request method.
   *
   * @param application Express application.
   * @param requestMethod HTTP Request method.
   *
   * @returns A callback for given HTTP request method.
   */
  private static findRouterMethod(application: Application, requestMethod: RequestMethod) {
    switch (requestMethod) {
      case RequestMethod.ALL:
        return application.all;
      case RequestMethod.DELETE:
        return application.delete;
      case RequestMethod.POST:
        return application.post;
      case RequestMethod.PUT:
        return application.put;
      default:
        return application.get;
    }
  }

  /**
   * Resolve a middleware instance and its configuration for given modules.
   *
   * @param modules Modules to be analyzed.
   */
  static resolveMiddlewares(modules: Map<AppModule, ModuleDependency>): void {
    modules.forEach((module: ModuleDependency, prototype: AppModule) => {
      const instance = module.instance;

      this.loadConfiguration(instance, prototype);
      this.resolver.resolveInstances(module, prototype);
    });
  }

  /**
   * Loads the configuration for given module instance.
   *
   * @param instance Module instance.
   * @param prototype Module prototype.
   */
  static loadConfiguration(instance: AppModule | any, prototype: AppModule): void {
    if (!instance.configure) {
      return;
    }

    const builder = new MiddlewareBuilder();
    instance.configure(builder);

    if (builder instanceof MiddlewareBuilder) {
      this.container.addConfig(builder.build(), prototype);
    }
  }
}
