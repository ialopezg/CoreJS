import { Transport } from '../../common';
import { ClientMetadata } from '../interfaces';
import { ProxyClient } from './proxy.client';
import { RedisClient } from './redis.client';
import { TCPClient } from './tcp.client';

/**
 * Creates instances of Client Proxy instances.
 */
export class ProxyClientFactory {
  /**
   * Creates a ProxyClient based instance.
   *
   * @param metadata Metadata information.
   */
  static create(metadata: ClientMetadata): ProxyClient {
    const { transport } = metadata;

    switch (transport) {
      case Transport.REDIS:
        return new RedisClient(metadata);
      default:
        return new TCPClient(metadata);
    }
  }
}
