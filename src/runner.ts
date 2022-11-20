import * as express from 'express';

import { Application, ApplicationFactory, ModuleMetaType } from './common/interfaces';
import { LoggerService } from './common';
import { ExpressAdapter } from './core/adapters';
import { APPLICATION_START, APPLICATION_READY } from './core/constants';
import { AppContainer, InstanceLoader } from './core/injector';
import { DependencyScanner } from './core/scanner';
import { RoutesResolver } from './core/router';
import { SocketModule } from './socket/module';
import { MiddlewareModule } from './core/middleware/module';
import { ExceptionWrapper } from './errors';

export class AppRunner {
  private static readonly logger = new LoggerService(AppRunner.name);
  private static readonly container = new AppContainer();
  private static dependenciesScanner = new DependencyScanner(AppRunner.container);
  private static loader = new InstanceLoader(AppRunner.container);
  private static routesResolver = new RoutesResolver(AppRunner.container, ExpressAdapter);

  /**
   * Application entry point.
   *
   * @param prototype Application prototype.
   * @param target Target Application module.
   */
  static run(prototype: ApplicationFactory, target: ModuleMetaType): void {
    ExceptionWrapper.run(() => {
      this.initialize(target);
      this.setupModules();
      this.startApplication(prototype);
    });
  }

  /**
   * Initialize all modules and their dependencies/
   *
   * @param target Module to be initialized.
   */
  private static initialize(target: ModuleMetaType) {
    this.logger.log(APPLICATION_START);

    this.dependenciesScanner.scan(target);
    this.loader.createInstancesOfDependencies();
  }

  /**
   * Setup all additional modules.
   */
  private static setupModules() {
    SocketModule.setup(this.container);
    MiddlewareModule.setup(this.container);
  }

  /**
   * Start the main application with given parameters.
   *
   * @param prototype Application prototype to be loaded.
   */
  private static startApplication(prototype: ApplicationFactory) {
    const appInstance = this.setupApplication(prototype);

    this.logger.log(APPLICATION_READY);

    appInstance.start();
  }

  /**
   * Set up the main application.
   *
   * @param app Application prototype to be set up.
   *
   * @returns An application base.
   */
  private static setupApplication<T extends ApplicationFactory>(app: T): Application {
    const expressInstance = ExpressAdapter.create();
    // eslint-disable-next-line new-cap
    const appInstance = new app(expressInstance);

    this.setupMiddlewares(expressInstance);
    this.setupRoutes(expressInstance);

    return appInstance;
  }

  /**
   * Setup module middlewares.
   *
   * @param expressInstance Express Application to be used.
   */
  private static setupMiddlewares(expressInstance: express.Application) {
    MiddlewareModule.setupMiddlewares(expressInstance);
  }

  /**
   * Setup module routes.
   *
   * @param expressInstance Express Application to be used.
   */
  private static setupRoutes(expressInstance: express.Application) {
    this.routesResolver.resolve(expressInstance);
  }
}
