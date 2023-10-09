import { Application } from 'express';

import { ApplicationFactory, IApplication, IModule } from './common/interfaces';
import { InstanceLoader, ModuleContainer } from './core/injector';
import { DependencyScanner } from './core/scanner';
import { SocketModule } from './socket/module';
import { RouteResolver } from './core/router';
import { MiddlewareModule } from './core/middleware';
import { ExceptionWrapper } from './errors';
import { ExpressAdapter } from './core/adapters';

export class Runner {
  private static container = new ModuleContainer();
  private static scanner = new DependencyScanner(Runner.container);
  private static loader = new InstanceLoader(Runner.container);
  private static resolver = new RouteResolver(Runner.container, ExpressAdapter);

  static run(application: ApplicationFactory, target: IModule | any): void {
    ExceptionWrapper.run(() => {
      this.initialize(target);
      this.setupModules();
      this.start(application);
    });

  }

  private static initialize(target: IModule): void {
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
    console.log('test');
  }
}
