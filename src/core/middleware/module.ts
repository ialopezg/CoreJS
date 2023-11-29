import 'reflect-metadata';

import { isUndefined } from '@ialopezg/commonjs';
import { Application } from 'express';

import { ControllerMetadata, IModule, MetaType } from '../../common/interfaces';
import { RequestMethod } from '../../common';
import { InvalidMiddlewareException, RuntimeException } from '../../errors';
import { ExceptionHandler } from '../exceptions';
import { RouterMethodFactory } from '../helpers';
import { Module, ModuleContainer } from '../injector';
import { RouterProxy } from '../router';
import { MiddlewareBuilder } from './builder';
import { MiddlewareContainer } from './container';
import { IMiddleware, MiddlewareConfiguration } from './interfaces';
import { RoutesMapper } from './mapper';
import { MiddlewareResolver } from './resolver';

export class MiddlewareModule {
  private static container = new MiddlewareContainer(new RoutesMapper());
  private static resolver: MiddlewareResolver;
  private static routerProxy = new RouterProxy(new ExceptionHandler());
  private static routerMethodFactory = new RouterMethodFactory();

  /**
   * Get the current container of middlewares.
   */
  public static getContainer(): MiddlewareContainer {
    return this.container;
  }

  /**
   * Resolve middleware instances.
   *
   * @param {Map<string, Module>} modules Module collection.
   */
  public static resolveMiddlewares(modules: Map<string, Module>): void {
    modules.forEach((target, name) => {
      this.loadConfiguration(target.instance, name);
      this.resolver.resolve(target, name);
    });
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
    this.container.getConfigs().forEach((configs, parentName) => {
      [...configs].forEach((config) => {
        config.forRoutes.forEach((controller: ControllerMetadata & { method: RequestMethod }) => {
          this.setupControllerMiddleware(controller, config, parentName, app);
        });
      });
    });
  }

  private static setupControllerMiddleware(
    controller: ControllerMetadata & { method: RequestMethod },
    config: MiddlewareConfiguration,
    parentName: string,
    application: Application,
  ): void {
    const { path, method } = controller;

    [].concat(config.middlewares).forEach((metaType) => {
      const middlewares = this.container.getMiddlewares(parentName);
      const middleware = middlewares.get(metaType.name);
      if (isUndefined(middleware)) {
        throw new RuntimeException();
      }

      const instance = middleware.instance;
      this.setupHandler(instance, metaType, application, method, path);
    });
  }

  private static loadConfiguration(
    target: IModule,
    moduleName: string,
  ): void {
    if (!target.configure) {
      return;
    }

    const builder = new MiddlewareBuilder();
    target.configure(builder);

    if (!(builder instanceof MiddlewareBuilder)) {
      return;
    }

    const config = builder.build();
    this.container.addConfig(config, moduleName);
  }

  private static setupHandler(
    target: IMiddleware,
    metaType: MetaType<IMiddleware>,
    application: Application,
    method: RequestMethod,
    path: string,
  ): void {
    if (isUndefined(target.resolve)) {
      throw new InvalidMiddlewareException(metaType.name);
    }

    const router = this.routerMethodFactory.get(application, method).bind(application);
    const proxy = this.routerProxy.createProxy(target.resolve());

    router(path, proxy);
  }
}
