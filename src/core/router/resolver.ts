import { Application } from 'express';

import { AppMode } from '../../common/enums';
import { Controller } from '../../common/interfaces';
import { LoggerService } from '../../common';

import { ExpressAdapter } from '../adapters';
import { ExceptionHandler } from '../exceptions';
import { getControllerMappingMessage } from '../helpers';
import { AppContainer, InstanceWrapper } from '../injector';
import { Module } from '../injector/module';
import { RouterBuilder } from './builder';
import { RouterProxy } from './proxy';

/**
 * Defines an object that resolve all registered module controllers.
 */
export class RoutesResolver {
  private readonly logger = new LoggerService(RoutesResolver.name);
  private readonly proxy = new RouterProxy(new ExceptionHandler());
  private builder: RouterBuilder;

  /**
   * Creates a new instance of RoutesResolver class with given parameters.
   *
   * @param container Module container.
   * @param adapter Express adapter.
   * @param mode Application execution mode.
   */
  constructor(
    private readonly container: AppContainer,
    private readonly adapter: ExpressAdapter,
    private mode = AppMode.RUN,
  ) {
    this.builder = new RouterBuilder(this.proxy, this.adapter, mode);
  }

  /**
   * Resolve all routes from registered module controllers.
   *
   * @param application Express application to be used.
   */
  resolve(application: Application): void {
    const modules = this.container.getModules();

    modules.forEach(({ controllers }: Module) => this.setupControllers(controllers, application));
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
    controllers.forEach(({ instance, metaType }: InstanceWrapper<Controller>) => {
      if (this.mode === AppMode.RUN) {
        this.logger.log(getControllerMappingMessage(metaType.name));
      }
      const { path, router } = this.builder.build(instance, metaType);

      application.use(path, router);
    });
  }
}
