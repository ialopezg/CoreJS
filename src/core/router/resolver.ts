import { Application } from 'express';

import { IController } from '../../common/interfaces';
import { ExpressAdapter } from '../adapters';
import { ExceptionHandler } from '../exceptions';
import { InstanceWrapper, ModuleContainer } from '../injector';
import { RouterBuilder } from './builder';
import { RouterProxy } from './proxy';
import { ApplicationMode, LoggerService } from '../../common';
import { getControllerMappingMessage } from '../helpers';

export class RouteResolver {
  private readonly logger = new LoggerService(RouteResolver.name);
  private readonly proxy = new RouterProxy(new ExceptionHandler());
  private readonly builder: RouterBuilder;

  /**
   * Creates a new instance of RouteResolver class.
   *
   * @param {ModuleContainer} container Modules container.
   * @param {ExpressAdapter} adapter Express application adapter.
   * @param {ApplicationMode} mode Application execution mode.
   */
  constructor(
    private readonly container: ModuleContainer,
    private readonly adapter: ExpressAdapter,
    private readonly mode: ApplicationMode = ApplicationMode.RUN,
  ) {
    this.builder = new RouterBuilder(this.proxy, this.adapter, mode);
  }

  public resolve(application: Application): void {
    this.container.getModules()
      .forEach(
        ({ controllers }) => this.setupControllers(controllers, application),
      );
  }

  private setupControllers(
    controllers: Map<string, InstanceWrapper<IController>>,
    application: Application,
  ): void {
    controllers.forEach(({ instance, metaType }) => {
      if (this.mode === ApplicationMode.RUN) {
        this.logger.log(getControllerMappingMessage(metaType.name))
      }

      const { path, router } = this.builder.build(instance, metaType);
      application.use(path, router);
    });
  }
}
