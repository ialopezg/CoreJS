import * as express from 'express';

import { ApplicationFactory, Application, AppModule } from './common/interfaces';
import { ExpressAdapter } from './core/adapters';
import { AppContainer, InstanceLoader } from './core/injector';
import { MiddlewareModule } from './core/middleware/module';
import { RoutesResolver } from './core/router';
import { DependencyScanner } from './core/scanner';
import { ExceptionWrapper } from './errors/wrapper';
import { SocketModule } from './socket/module';

export class AppRunner {
  private static readonly container = new AppContainer();
  private static readonly scanner = new DependencyScanner(AppRunner.container);
  private static readonly loader = new InstanceLoader(AppRunner.container);
  private static readonly resolver = new RoutesResolver(AppRunner.container, ExpressAdapter);

  /**
   * App entry point.
   */
  static run(prototype: ApplicationFactory, module: AppModule | any): void {
    ExceptionWrapper.run(() => {
      this.initialize((module));
      this.setupModules();
      this.startApplication(prototype);
    });
  }

  /**
   * Initialize all modules and their dependencies/
   *
   * @param module Module to be initialized.
   */
  private static initialize(module: AppModule): void {
    this.scanner.scan(module);
    this.loader.createInstancesOfDependencies();
  }

  /**
   * Setup all additional modules.
   */
  private static setupModules(): void {
    SocketModule.setup(AppRunner.container);
    MiddlewareModule.setup(AppRunner.container);
  }

  private static startApplication(prototype: ApplicationFactory): void {
    const application = this.setupApplication(prototype);
    application.start();
  }

  /**
   * Set up the application to be loaded.
   *
   * @param prototype Application prototype.
   *
   * @returns The instance of requested application.
   */
  private static setupApplication<T extends ApplicationFactory>(prototype: T): Application {
    const expressInstance = express();
    // eslint-disable-next-line new-cap
    const application = new prototype(expressInstance);

    this.setupMiddlewares(expressInstance);
    this.setupRoutes(expressInstance);

    return application;
  }

  /**
   * Setup all middlewares for given Express application.
   *
   * @param application Express application to be used.
   */
  private static setupMiddlewares(application: express.Application): void {
    MiddlewareModule.setupMiddlewares(application);
  }

  /**
   * Setup all routes for given Express application.
   *
   * @param application Express application to be used.
   */
  private static setupRoutes(application: express.Application): void {
    this.resolver.resolve(application);
  }
}
