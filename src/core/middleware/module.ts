import 'reflect-metadata';

import { Application, IRouterMatcher } from 'express';

import { ControllerMetadata, IModule } from '../../common/interfaces';
import { RequestMethod } from '../../common';
import { InvalidMiddlewareException, UnknownMiddlewareException } from '../../errors';
import { ModuleContainer, ModuleDependencies } from '../injector';
import { MiddlewareBuilder } from './builder';
import { MiddlewareContainer } from './container';
import { MiddlewareConfiguration } from './interfaces';
import { RoutesMapper } from './mapper';
import { MiddlewareResolver } from './resolver';

export class MiddlewareModule {
  private static container = new MiddlewareContainer(new RoutesMapper());
  private static resolver: MiddlewareResolver;

  /**
   * Get the current container of middlewares.
   */
  public static getContainer(): MiddlewareContainer {
    return this.container;
  }

  /**
   * Prepares and configures middleware module.
   *
   * @param {ModuleContainer} container Modules container.
   */
  public static setup(container: ModuleContainer): void {
    this.resolver = new MiddlewareResolver(this.container);

    this.resolveMiddlewares(container.getModules());
  }

  /**
   * Setup all registered middlewares.
   *
   * @param {Express} app Application where the middlewares will be applied.
   */
  public static setupMiddlewares(app: Application): void {
    this.container.getConfigs().forEach((configs, parent) => {
      [...configs].forEach((config) => {
        config.forRoutes.forEach((controller: ControllerMetadata & { method: RequestMethod }) => {
          this.setupControllerMiddleware(controller, config, parent, app);
        });
      });
    });
  }

  private static setupControllerMiddleware(
    controller: ControllerMetadata & { method: RequestMethod },
    config: MiddlewareConfiguration,
    parent: IModule,
    app: Application,
  ) {
    const { path, method } = controller;

    [].concat(config.middlewares).forEach((prototype) => {
      const middleware = this.container.getMiddlewares(parent).get(prototype);

      if (typeof middleware === 'undefined') {
        throw new UnknownMiddlewareException();
      }
      if (typeof middleware.resolve === 'undefined') {
        throw new InvalidMiddlewareException((<any>middleware).name);
      }

      const router = this.findRouterMethod(app, method).bind(app);
      router(path, middleware.resolve());
    });
  }

  private static findRouterMethod(
    app: Application,
    requestMethod: RequestMethod,
  ): IRouterMatcher<Application> {
    switch(requestMethod) {
      case RequestMethod.POST:
        return app.post;
      case RequestMethod.ALL:
        return app.all;
      case RequestMethod.DELETE:
        return app.delete;
      case RequestMethod.PUT:
        return app.put;
      default:
        return app.get;
    }
  }

  private static resolveMiddlewares(modules: Map<IModule, ModuleDependencies>): void {
    modules.forEach((module, prototype) => {
      this.loadConfiguration(module.instance, prototype);
      this.resolver.resolve(module, prototype);
    });
  }

  private static loadConfiguration(parent: IModule, module: IModule) {
    if (!parent.configure) {
      return;
    }

    const builder = new MiddlewareBuilder();
    parent.configure(builder);

    if (builder instanceof MiddlewareBuilder) {
      this.container.addConfig(builder.build(), module);
    }
  }
}
