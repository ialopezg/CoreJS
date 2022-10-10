import { Application } from 'express';
import { Controller } from '../../common/interfaces';

import { ExpressAdapter } from '../adapters';
import { ExceptionHandler } from '../exceptions';
import { AppContainer, InstanceWrapper, ModuleDependency } from '../injector';
import { RouterBuilder } from './builder';
import { RouterProxy } from './proxy';

/**
 * Defines an object that resolve all registered module controllers.
 */
export class RoutesResolver {
  private readonly proxy = new RouterProxy(new ExceptionHandler());
  private builder: RouterBuilder;

  /**
   * Creates a new instance of this class with given parameters.
   *
   * @param container Module container.
   * @param adapter Express adapter.
   */
  constructor(
    private readonly container: AppContainer,
    private readonly adapter: ExpressAdapter,
  ) {
    this.builder = new RouterBuilder(this.proxy, this.adapter);
  }

  /**
   * Resolve all routes from regiistered module controllers.
   *
   * @param application Express application to be used.
   */
  resolve(application: Application): void {
    const modules = this.container.getModules();

    modules.forEach(({ controllers }: ModuleDependency) => this.setupControllers(controllers, application));
  }

  /**
   * Setup given controllers as routes.
   *
   * @param controllers Controllers to be setup.
   * @param application Express application to be used.
   */
  setupControllers(
    controllers: Map<Controller, InstanceWrapper<Controller>>,
    application: Application,
  ) {
    controllers.forEach(({ instance }, prototype: Function) => {
      const { path, router } = this.builder.build(instance, prototype);

      application.use(path, router);
    });
  }
}
