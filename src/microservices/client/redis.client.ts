import { createClient, RedisClientType } from 'redis';
import * as redis from 'redis';

import { ClientMetadata } from '../interfaces';
import { LoggerService } from '../../common';
import { ClientProxy } from './proxy';

/**
 * Represents a Client in a Redis microservices.
 */
export class RedisClient extends ClientProxy {
  private readonly logger = new LoggerService(ClientProxy.name);
  private readonly DEFAULT_URL = 'redis://localhost:6379';
  private readonly url: string;
  private publisher: any;
  private subscriber: any;

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
  public sendSingleMessage(message: any, callback: (error: any, response: any) => void) {
    const pattern = JSON.stringify(message.pattern);
    const subscription = (channel: any, message: any) => {
      const { error, response } = JSON.parse(message);
      callback(error, response);

      this.subscriber.unsubscribe(this.getResPatternName(pattern));
      this.subscriber.removeListener('message', subscription);
    };

    this.subscriber.on('message', subscription);
    this.subscriber.subscribe(this.getResPatternName(pattern), subscription);
    this.publisher.publish(this.getAckPatternName(pattern) as any, JSON.stringify(message) as any);

    return subscription;
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

  private init() {
    this.publisher = this.createClient();
    this.subscriber = this.createClient();

    this.handleErrors(this.publisher);
    this.handleErrors(this.subscriber);
  }

  private handleErrors(stream: RedisClientType) {
    stream.on('error', (error) => this.logger.error(error));
  }
}
