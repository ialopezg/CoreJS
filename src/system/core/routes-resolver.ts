import { Express } from 'express';

import { RouterBuilder } from './router-builder';
import { AppContainer, InstanceWrapper, ModuleDependency } from './container';
import { Controller } from './interfaces';

export class AppRoutesResolver {
  private readonly routerBuilder: RouterBuilder;

  constructor(
    private readonly container: AppContainer,
    private readonly routerFactory: Function,
  ) {
    this.routerBuilder = new RouterBuilder(this.routerFactory);
  }

  resolve(expressInstance: Express): void {
    this.container.getModules().forEach((module: ModuleDependency) => {
      this.resolveRouters(module.controllers, expressInstance);
    });
  }

  private resolveRouters(
    controllers: Map<Controller, InstanceWrapper<Controller>>,
    expressInstance: Express,
  ) {
    controllers.forEach(({ instance }, route: Function) => {
      const { path, router } = this.routerBuilder.build(instance, route);

      expressInstance.use(path, router);
    });
  }
}
