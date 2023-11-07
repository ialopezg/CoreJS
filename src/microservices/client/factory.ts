import { ClientMetadata } from '../interfaces';
import { ClientProxy } from './proxy';
import { Transport } from '../../common';
import { RedisClient } from './redis.client';
import { TcpClient } from './tcp.client';

/**
 * Represents a factory for proxy-based clients.
 */
export class ClientProxyFactory {
  /**
   * Creates a proxy client instance with given parameters.
   *
   * @param {ClientMetadata} metadata Configuration parameters.
   */
  public static create(metadata: ClientMetadata): ClientProxy {
    const { transport } = metadata;

    switch (transport) {
      case Transport.REDIS:
        return new RedisClient(metadata);
      default:
        return new TcpClient(metadata);
    }
  }
}
