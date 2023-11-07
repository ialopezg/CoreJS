import { Transport } from '../../common';
import { MicroserviceConfiguration } from '../interfaces';
import { RedisServer } from './redis.server';
import { Server } from './server';
import { TcpServer } from './tcp.server';

/**
 * Represents a factory for microservices server instances.
 */
export class ServerFactory {
  /**
   * Creates a microservices server instance with given parameters.
   *
   * @param {MicroserviceConfiguration} config Configuration parameters.
   */
  public static create(config: MicroserviceConfiguration): Server {
    const { transport } = config;

    switch (transport) {
      case Transport.REDIS:
        return new RedisServer(config);
      default:
        return new TcpServer(config);
    }
  }
}
