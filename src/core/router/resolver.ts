import { Application } from 'express';

import { IController } from '../../common/interfaces';
import { ExpressAdapter } from '../adapters';
import { ExceptionHandler } from '../exceptions';
import { ModuleContainer, InstanceWrapper } from '../injector';
import { RouterBuilder } from './builder';
import { RouterProxy } from './proxy';

export class RouteResolver {
  private readonly proxy = new RouterProxy(new ExceptionHandler());
  private readonly builder: RouterBuilder;

  constructor(
    private readonly container: ModuleContainer,
    private readonly adapter: ExpressAdapter,
  ) {
    this.builder = new RouterBuilder(this.proxy, this.adapter);
  }

  public resolve(expressInstance: Application): void {
    this.container.getModules()
      .forEach(
        ({ controllers }) => this.setupControllers(controllers, expressInstance),
      );
  }

  private setupControllers(
    controllers: Map<IController, InstanceWrapper<IController>>,
    expressInstance: Application,
  ): void {
    controllers.forEach(({ instance }, controller) => {
      const { path, router } = this.builder.build(instance, controller);

      expressInstance.use(path, router);
    });
  }
}
