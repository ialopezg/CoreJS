import * as express from 'express';

import { AppContainer } from './core/container';
import { Application, AppModule } from './core/interfaces';
import { AppDependencyScanner } from './core/scanner';
import { AppInjector } from './core/injector';
import { SocketModule } from './socket/socket-module';
import { AppRoutesResolver } from './core/routes-resolver';
import { MiddlewaresModule } from './core/middlewares/module';

/**
 * Application runner or entry point.
 */
export class AppRunner {
  private static container = new AppContainer();
  private static dependencyScanner = new AppDependencyScanner(
    AppRunner.container,
  );
  private static injector = new AppInjector(AppRunner.container);
  private static routesResolver = new AppRoutesResolver(
    AppRunner.container,
    express.Router,
  );

  /**
   * Runs main application with given entry point module.
   *
   * @param prototype Application to be ran.
   * @param target Entry point or target module
   */
  static run(prototype: any, target: AppModule): void {
    this.dependencyScanner.scan(target);
    this.injector.createInstancesOfDependencies();

    this.setupModules();

    this.setupApplication(prototype).start();
  }

  /**
   * Prepares and configure the core application.
   *
   * @param app Requested application.
   *
   * @returns An instance of requested application.
   */
  static setupApplication<T extends ApplicationFactory>(app: {
    new (app: any): T;
  }): Application {
    try {
      const expressInstance = express();
      const appInstance = new app(expressInstance);

      MiddlewaresModule.setupMiddlewares(expressInstance);
      this.routesResolver.resolve(expressInstance);

      return appInstance;
    } catch (error) {
      throw new Error('Invalid application class passed as parameter.');
    }
  }

  /**
   * Setup additional modules.
   */
  private static setupModules(): void {
    SocketModule.setup(AppRunner.container);
    MiddlewaresModule.setup(AppRunner.container);
  }
}

/**
 * Application Factory prototy.
 */
interface ApplicationFactory extends Application {
  /**
   * Application constructor.
   */
  new (app: express.Application);
}
