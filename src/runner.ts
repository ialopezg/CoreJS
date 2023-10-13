import { Application } from 'express';

import { ApplicationFactory, IApplication, ModuleMetaType } from './common/interfaces';
import { InstanceLoader, ModuleContainer } from './core/injector';
import { DependencyScanner } from './core/scanner';
import { SocketModule } from './socket/module';
import { RouteResolver } from './core/router';
import { MiddlewareModule } from './core/middleware';
import { ExceptionWrapper } from './errors';
import { ExpressAdapter } from './core/adapters';
import { LoggerService } from './common';
import { APPLICATION_READY, APPLICATION_START } from './core/constants';

export class Runner {
  private static logger = new LoggerService(Runner.name);
  private static container = new ModuleContainer();
  private static scanner = new DependencyScanner(Runner.container);
  private static loader = new InstanceLoader(Runner.container);
  private static resolver = new RouteResolver(Runner.container, ExpressAdapter);

  static run(application: ApplicationFactory, target: ModuleMetaType): void {
    ExceptionWrapper.run(() => {
      this.logger.log(APPLICATION_START);
      this.initialize(target);
      this.setupModules();
      this.start(application);
      this.logger.log(APPLICATION_READY);
    });

  }

  private static initialize(target: ModuleMetaType): void {
    this.scanner.scan(target);
    this.loader.initialize();
  }

  private static setupModules(): void {
    SocketModule.setup(this.container);
    MiddlewareModule.setup(this.container)
  }

  private static start(application: ApplicationFactory) {
    const appInstance = this.configure(application);

    appInstance.start();
  }

  private static configure<T extends ApplicationFactory>(app: T): IApplication {
    try {
      const expressInstance = ExpressAdapter.create();
      const appInstance = new app(expressInstance);

      this.setupMiddlewares(expressInstance);
      this.setupControllers(expressInstance);

      return appInstance;
    } catch (error: any) {
      throw new Error('Invalid application class passed as parameter!');
    }
  }

  private static setupMiddlewares(expressInstance: Application) {
    MiddlewareModule.setupMiddlewares(expressInstance);
  }

  private static setupControllers(expressInstance: Application) {
    this.resolver.resolve(expressInstance);
  }
}
