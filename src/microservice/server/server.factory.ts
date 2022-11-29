import { Transport } from '../../common';
import { MicroserviceConfiguration } from '../interfaces';
import { RedisServer } from './redis.server';
import { Server } from './server';
import { TCPServer } from './tcp.server';

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
        return new RedisServer(config);
      default:
        return new TCPServer(config);
    }
  }
}
