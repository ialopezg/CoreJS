import { LoggerService, Transport } from './common';
import { ModuleContainer } from './core/injector';
import { MicroserviceConfiguration } from './microservices';
import { Server, ServerFactory } from './microservices/server';
import { MicroserviceModule } from './microservices/module';
import { messages } from './core/constants';

/**
 * Represents the main entry for a microservice.
 */
export class Microservice {
  private logger = new LoggerService(Microservice.name);
  private readonly server: Server
  private readonly config: MicroserviceConfiguration;

  /**
   * Creates a new instance of Microservice class.
   *
   * @param {ModuleContainer} container Module container.
   * @param {MicroserviceConfiguration} config Microservice application.
   */
  constructor(
    private readonly container: ModuleContainer,
    config: MicroserviceConfiguration,
  ) {
    this.config = {
      transport: Transport.TCP,
      ...config,
    };
    this.server = ServerFactory.create(this.config);
  }

  /**
   * Initializes the microservices to receive requests and respond.
   *
   * @param {Function} callback Microservice callback to be executed after initialized.
   */
  public listen(callback: () => void): void {
    this.server.listen(callback);

    this.logger.log(messages.APPLICATION_READY);
  }

  /**
   * Setup and prepares the microservice context.
   */
  public setup(): void {
    MicroserviceModule.setupClients(this.container);
    MicroserviceModule.setupListeners(this.container, this.server);
  }
}

