import { LoggerService, Transport } from './common';
import { messages } from './core/constants';
import { Container } from './core/injector';
import { MicroserviceConfiguration } from './microservice/interfaces';
import { MicroservicesModule } from './microservice/module';
import { Server, ServerFactory } from './microservice/server';

/**
 * Module for a microservice.
 */
export class Microservice {
  private readonly logger = new LoggerService(Microservice.name);
  private readonly config: MicroserviceConfiguration;
  private readonly server: Server;

  /**
   * Creates a new instance of Microservice class with given parameters.
   *
   * @param container Modules container.
   * @param config Microservice configuration.
   */
  constructor(private readonly container: Container, config: MicroserviceConfiguration) {
    this.config = {
      transport: Transport.TCP,
      ...config,
    };
    this.server = ServerFactory.create(this.config);
  }

  /**
   * Allows microservice to accept incoming connections.
   */
  listen(callback: () => void): void {
    this.logger.log(messages.APPLICATION_READY);
    this.server.listen(callback);
  }

  /**
   * Setup all registered modules.
   */
  setup(): void {
    MicroservicesModule.setupClients(this.container);
    MicroservicesModule.setupListeners(this.container, this.server);
  }
}
