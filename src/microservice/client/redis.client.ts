import { createClient, RedisClientType } from 'redis';

import { LoggerService } from '../../common';
import { ClientMetadata } from '../interfaces';
import { ProxyClient } from './proxy.client';

/**
 * Redis Client instance.
 */
export class RedisClient extends ProxyClient {
  private readonly logger = new LoggerService(ProxyClient.name);
  private readonly defaultUrl = 'redis://localhost:6379';
  private readonly url: string;
  private publisher: RedisClientType;
  private subscriber: RedisClientType;

  /**
   * Creates a new instance of the ClientRedis instance.
   *
   * @param config Client metadata information.
   */
  constructor({ url }: ClientMetadata) {
    super();

    this.url = url || this.defaultUrl;

    this.init();
  }

  /**
   * Sends a single message with given parameters.
   *
   * @param message Message to be sent.
   * @param callback Function to be executed.
   */
  sendSingleMessage(message: any, callback: Function): void {
    const pattern = JSON.stringify(message.pattern);
    const subscription = (channel: any, message: any) => {
      const { error, response } = JSON.parse(message);
      callback(error, response);

      this.subscriber.unsubscribe(RedisClient.getResPatternName(pattern))
        .then((result) => result);
      this.subscriber.removeListener('message', subscription);
    };

    this.subscriber.on('message', subscription);
    this.subscriber.subscribe(RedisClient.getResPatternName(pattern), subscription)
      .then((result) => result);
    this.publisher.publish(RedisClient.getAckPatternName(pattern), JSON.stringify(message))
      .then((result) => result);
  }

  /**
   * Get the Ack patterns name normalized.
   *
   * @param pattern Pattern name.
   *
   * @returns A normalized pattern name.
   */
  static getAckPatternName(pattern: string): string {
    return `${pattern}_ack`;
  }

  /**
   * Get the resource patterns name normalized.
   *
   * @param pattern Pattern name.
   *
   * @returns A normalized pattern name.
   */
  static getResPatternName(pattern: string): string {
    return `${pattern}_res`;
  }

  /**
   * Initialize a ClientRedis instance.
   */
  private init(): void {
    this.publisher = this.createClient();
    this.subscriber = this.createClient();

    this.handleErrors(this.publisher);
    this.handleErrors(this.subscriber);
  }

  /**
   * Creates a Redis client type.
   *
   * @returns An instance of RedisClientType.
   */
  private createClient(): RedisClientType {
    return createClient({ url: this.url });
  }

  /**
   * Handler errors applying given streamer.
   *
   * @param stream Redis client type to be used.
   */
  private handleErrors(stream: RedisClientType): void {
    stream.on('error', (error) => this.logger.error(error));
  }
}
