import { Transport } from '../../common';
import { MicroserviceConfiguration } from '../interfaces';
import { ServerRedis } from './server.redis';
import { Server } from './server';
import { ServerTCP } from './server.tcp';

/**
 * Factory creator for Server instances.
 */
export class ServerFactory {
  /**
   * Creates a Microservice server with given configuration.
   *
   * @param config Configuration to be applied.
   *
   * @returns An instance of Server based class.
   */
  static create(config: MicroserviceConfiguration): Server {
    const { transport } = config;

    switch (transport) {
      case Transport.REDIS:
        return new ServerRedis(config);
      default:
        return new ServerTCP(config);
    }
  }
}
