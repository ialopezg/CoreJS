import * as express from 'express';
import { Application, Router } from 'express';

import { IApplication, IModule } from './interfaces';
import { ModuleContainer } from './container';
import { DependencyScanner } from './scanner';
import { Injector } from './injector';
import { SocketModule } from '../socket/module';
import { RoutesResolver } from './routes-resolver';
import { MiddlewareModule } from './middleware/module';

export class Runner {
  private static container = new ModuleContainer();

  private static scanner = new DependencyScanner(Runner.container);
  private static injector = new Injector(Runner.container);
  private static resolver = new RoutesResolver(Runner.container, Router);

  static run<T extends IApplication>(prototype: any, module: IModule) {
    this.scanner.scan(module);
    this.injector.initialize();

    this.setupModules();

    this.setupApplication(prototype).start();
  }

  private static setupModules(): void {
    SocketModule.setup(this.container);
    MiddlewareModule.setup(this.container)
  }

  private static setupApplication<T extends IApplicationFactory>(app: { new(app): T }): IApplication {
    try {
      const expressInstance = express();
      const appInstance = new app(expressInstance);

      MiddlewareModule.setupMiddlewares(expressInstance);

      this.resolver.resolve(expressInstance);

      return appInstance;
    } catch (error: any) {
      throw new Error('Invalid application class passed as parameter!');
    }
  }
}

/**
 * Application Factory
 */
interface IApplicationFactory extends IApplication {
  /**
   * Application entry point.
   *
   * @param {Application} app Application to be configured.
   */
  new(app: Application);
}
