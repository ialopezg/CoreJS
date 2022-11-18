import { Application } from 'express';

import { AppModule, isUndefined, RequestMethod, RuntimeException } from '../../common';
import { ControllerMetadata, MetaType } from '../../common/interfaces';
import { InvalidMiddlewareException } from '../../errors/exceptions';
import { ExceptionHandler } from '../exceptions';
import { RouterMethodFactory } from '../helpers';
import { AppContainer } from '../injector';
import { Module } from '../injector/module';
import { RouterProxy } from '../router';
import { MiddlewareBuilder } from './builder';
import { MiddlewareContainer, MiddlewareWrapper } from './container';
import { AppMiddleware, MiddlewareConfiguration } from './interfaces';
import { RoutesMapper } from './mapper';
import { MiddlewareResolver } from './resolver';

/**
 * Represents an object that injects middlewares into module instances.
 */
export class MiddlewareModule {
  private static readonly container = new MiddlewareContainer(new RoutesMapper());
  private static resolver: MiddlewareResolver;
  private static proxy = new RouterProxy(new ExceptionHandler());
  private static factory = new RouterMethodFactory();

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

    configs.forEach((moduleConfig, moduleName) => {
      [...moduleConfig].forEach((config) => {
        config.forRoutes.forEach((controller: ControllerMetadata & { method: RequestMethod }) => {
          this.setupControllerMiddleware(controller, config, moduleName, application);
        });
      });
    });
  }

  /**
   * Set up a controller for its middlewares.
   *
   * @param controller Controller to be setup.
   * @param config Middleware configuration to be applied.
   * @param moduleName Module that contains the Controller.
   * @param application Express application to be used.
   */
  static setupControllerMiddleware(
    controller: ControllerMetadata & { method: RequestMethod },
    config: MiddlewareConfiguration,
    moduleName: string,
    application: Application,
  ): void {
    const { path, method } = controller;
    [].concat(config.middlewares).forEach((target: any) => {
      const middlewares = this.container.getMiddlewares(moduleName);
      const middleware: MiddlewareWrapper = middlewares.get(target.name);
      if (isUndefined(middleware)) {
        throw new RuntimeException();
      }

      this.setupHandler(middleware.instance, target, application, method, path);
    });
  }

  /**
   * Set up the handler for a express route.
   *
   * @param instance Application middleware instance,
   * @param metaType Middleware MetaType information.
   * @param app Express application.
   * @param method HTTP Request method.
   * @param path Route path.
   */
  private static setupHandler(
    instance: AppMiddleware,
    metaType: MetaType<AppMiddleware>,
    app: Application,
    method: RequestMethod,
    path: string,
  ) {
    if (isUndefined(instance.resolve)) {
      throw new InvalidMiddlewareException(metaType.name);
    }

    const router = this.factory.get(app, method).bind(app);
    const proxy = this.proxy.create(instance.resolve());

    router(path, proxy);
  }

  /**
   * Resolve a middleware instance and its configuration for given modules.
   *
   * @param modules Modules to be analyzed.
   */
  static resolveMiddlewares(modules: Map<string, Module>): void {
    modules.forEach((target: Module, moduleName: string) => {
      const instance = target.instance;

      this.loadConfiguration(instance, moduleName);
      this.resolver.resolveInstances(target, moduleName);
    });
  }

  /**
   * Loads the configuration for given module instansce.
   *
   * @param instance Module instance.
   * @param moduleName Module prototype.
   */
  static loadConfiguration(instance: AppModule, moduleName: string): void {
    if (!instance.configure) {
      return;
    }

    const builder = new MiddlewareBuilder();
    instance.configure(builder);

    if (builder instanceof MiddlewareBuilder) {
      this.container.addConfig(builder.build(), moduleName);
    }
  }
}
