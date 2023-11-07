import * as express from 'express';

import { ModuleContainer } from './core/injector';
import { LoggerService } from './common';
import { RouteResolver } from './core/router';
import { ExpressAdapter } from './core/adapters';
import { SocketModule } from './websocket/module';
import { MiddlewareModule } from './core/middleware';
import { messages } from './core/constants';
import { MicroserviceModule } from './microservices/module';

/**
 * Represents the main entry for a web app.
 */
export class Application {
  private readonly logger = new LoggerService(Application.name);
  private readonly resolver: RouteResolver;

  /**
   * Creates a new instance of Application class.
   *
   * @param {ModuleContainer} container Module container.
   * @param {express} express Express application.
   */
  constructor(
    private readonly container: ModuleContainer,
    private readonly express: express.Application,
  ) {
    this.resolver = new RouteResolver(container, ExpressAdapter);
  }

  /**
   * Setup and prepares the application context.
   */
  public setup(): void {
    SocketModule.setup(this.container);
    MiddlewareModule.setup(this.container);
    MicroserviceModule.setupClients(this.container);
  }

  /**
   * Initializes the application to receive requests and respond.
   *
   * @param {number} port Application port.
   * @param {Function} callback Application callback to be executed after initialized.
   */
  public listen(port: number, callback: () => void) {
    this.setupMiddlewares(this.express);
    this.setupControllers(this.express);

    this.logger.log(messages.APPLICATION_READY);

    return this.express.listen(port, callback);
  }

  private setupMiddlewares(instance: express.Application) {
    MiddlewareModule.setupMiddlewares(instance);
  }

  private setupControllers(instance: express.Application) {
    this.resolver.resolve(instance);
  }
}
