import * as express from 'express';
import { Application, Router } from 'express';

import { IApplication, IModule } from './interfaces';
import { ModulesContainer } from './container';
import { DependencyScanner } from './scanner';
import { Injector } from './injector';
import { SocketModule } from '../socket/module';
import { RoutesResolver } from './routes-resolver';

export class Runner {
  private static container = new ModulesContainer();

  private static scanner = new DependencyScanner(Runner.container);
  private static injector = new Injector(Runner.container);
  private static resolver = new RoutesResolver(Runner.container, Router);

  static run<T extends IApplication>(prototype: any, module: IModule) {
    this.scanner.scan(module);
    this.injector.createInstances();

    this.setupModules();

    this.setupApplication(prototype).start();
  }

  private static setupModules(): void {
    SocketModule.setup(Runner.container);
  }

  private static setupApplication<T extends IApplicationFactory>(app: { new(app): T }): IApplication {
    try {
      const expressInstance = express();
      this.resolver.resolve(expressInstance);

      return new app(expressInstance);
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
