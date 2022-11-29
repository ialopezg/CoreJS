import * as express from 'express';
import { LoggerService } from './common';

import { ExpressAdapter } from './core/adapters';
import { messages } from './core/constants';
import { Container } from './core/injector';
import { MiddlewareModule } from './core/middleware/module';
import { RoutesResolver } from './core/router';
import { MicroservicesModule } from './microservice/module';
import { SocketModule } from './websocket/socket.module';

export class Application {
  private readonly logger = new LoggerService(Application.name);
  private resolver: RoutesResolver;

  constructor(
    private readonly container: Container,
    private readonly express: express.Application,
  ) {
    this.resolver = new RoutesResolver(this.container, ExpressAdapter);
  }

  setup() {
    SocketModule.setup(this.container);
    MiddlewareModule.setup(this.container);
    MicroservicesModule.setupClients(this.container);
  }

  listen(port: number, callback: () => void) {
    this.setupMiddlewares(this.express);
    this.setupRoutes(this.express);

    this.logger.log(messages.APPLICATION_READY);

    return this.express.listen(port, callback);
  }

  private setupMiddlewares(instance: express.Application): void {
    MiddlewareModule.setupMiddlewares(instance);
  }

  private setupRoutes(instance: express.Application): void {
    this.resolver.resolve(instance);
  }
}
