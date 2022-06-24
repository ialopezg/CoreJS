import * as express from 'express';

import { Container } from './core/container';
import { Application, AppModule } from './core/interfaces';
import { AppDependencyScanner } from './core/scanner';
import { AppInjector } from './core/injector';
import { SocketModule } from './socket/socket-module';
import { AppRoutesResolver } from './core/routes-resolver';

export class AppRunner {
  private static container = new Container();
  private static dependencyScanner = new AppDependencyScanner(
    AppRunner.container,
  );
  private static injector = new AppInjector(AppRunner.container);
  private static routesResolver = new AppRoutesResolver(
    AppRunner.container,
    express.Router,
  );

  static run(prototype: any, module: AppModule): void {
    this.dependencyScanner.scan(module);
    this.injector.createInstancesOfDependencies();

    this.setupModules();

    this.setupApplication(prototype).start();
  }

  static setupApplication<T extends ApplicationFactory>(app: {
    new (app: any): T;
  }): Application {
    try {
      const expressInstance = express();
      this.routesResolver.resolve(expressInstance);

      return new app(expressInstance);
    } catch (error) {
      console.log(error);
      throw new Error('Invalid application class passed as parameter.');
    }
  }

  private static setupModules(): void {
    SocketModule.setup(AppRunner.container);
  }
}

interface ApplicationFactory extends Application {
  new (app: express.Application);
}
