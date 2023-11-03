import { createClient, RedisClientType } from 'redis';

import { ClientMetadata } from '../interfaces';
import { LoggerService } from '../../common';
import { ClientProxy } from './proxy';

/**
 * Represents a Client in a Redis microservice.
 */
export class RedisClient extends ClientProxy {
  private readonly logger = new LoggerService(ClientProxy.name);
  private readonly DEFAULT_URL = 'redis://localhost:6379';
  private readonly url: string;
  private publisher: RedisClientType;
  private subscriber: RedisClientType;

  /**
   * Creates a new instance of the RedisClient class.
   *
   * @param {string} url Base url.
   */
  constructor({ url }: ClientMetadata) {
    super();

    this.url = url ?? this.DEFAULT_URL;
    this.init();
  }

  /**
   * Sends a single message.
   *
   * @param message Message pattern.
   * @param callback Function to be executed after sent the message.
   */
  public sendSingleMessage(message: any, callback: Function) {
    const pattern = JSON.stringify(message.pattern);
    const listener = (channel: any, message: any) => {
      const { error, response } = JSON.parse(message);
      callback(error, response);

      void this.publisher.unsubscribe(this.getResPatternName(pattern));
      this.subscriber.removeListener('message', listener);
    };
    void this.subscriber.on('message', listener);

    void this.subscriber.subscribe(this.getResPatternName(pattern), listener);
    void this.publisher.publish(this.getAckPatternName(pattern) as any, JSON.stringify(message) as any);
  }

  private init() {
    this.publisher = this.createClient();
    this.subscriber = this.createClient();

    this.handleErrors(this.publisher);
    this.handleErrors(this.subscriber);
  }

  private createClient(): RedisClientType {
    return createClient({ url: this.url });
  }

  private getAckPatternName(pattern: string): string {
    return `${pattern}_ack`;
  }

  private getResPatternName(pattern: string): string {
    return `${pattern}_res`;
  }

  private handleErrors(stream: RedisClientType) {
    stream.on('error', (error) => this.logger.error(error));
  }
}
