import { createClient } from 'redis';

import { MicroserviceConfiguration } from '../interfaces';
import { Server } from './server';
import { NO_PATTERN_MESSAGE } from '../constants';
import { RedisClient } from '../client';

/**
 * Represents a Server in a Redis microservice.
 */
export class RedisServer extends Server {
  private readonly DEFAULT_URL = 'redis://localhost:6739';
  private readonly url: string;

  /**
   * Creates a new instance of RedisServer class.
   *
   * @param {MicroserviceConfiguration} config Server configuration.
   */
  constructor(config: MicroserviceConfiguration) {
    super();

    this.url = config.url ?? this.DEFAULT_URL;
  }

  /**
   * Initializes the microservice to act as a listener server.
   *
   * @param {Function} callback Function to be executed after server starts.
   */
  public listen(callback?: () => void): void {
    const publisher = createClient({ url: this.url });
    const subscriber = createClient({ url: this.url });

    subscriber.on(
      'connect',
      () => this.onConnect(callback, subscriber, publisher),
    );
  }

  private getPublisher(publisher: any, pattern: any) {
    return (response) => {
      void publisher.publish(
        this.getResQueueName(pattern),
        JSON.stringify(response) as any,
      );
    };
  }

  private getAckQueueName(pattern: any): any {
    return `${pattern}_ack`;
  }

  private getResQueueName(pattern: any): any {
    return `${pattern}_res`;
  }

  private onConnect(
    callback: () => void,
    subscriber: any,
    publisher: any,
  ): void {
    subscriber.on('message', (channel, buffer) => this.onMessage(channel, buffer, publisher));

    const patterns = Object.keys(this.handlers);
    patterns.forEach(
      (pattern) => (<any>subscriber).subscribe(this.getAckQueueName(pattern)),
    );
    callback && callback();
  }

  private onMessage(channel, buffer, publisher: any): void {
    const message = this.parse(buffer);
    const pattern = channel.replace(/_ack$/, '');
    const publish = this.getPublisher(publisher, pattern);

    if (!this.handlers[pattern]) {
      publish({ error: NO_PATTERN_MESSAGE });

      return;
    }

    const handler = this.handlers[pattern];
    handler(message.data, this.onMessageCallback(publisher, pattern).bind(this));
  }

  private onMessageCallback(publisher: RedisClient, pattern: any) {
    return (error, response) => {
      const publish = this.getPublisher(publisher, pattern);
      if (!response) {
        publish({ error: null, response: error });

        return;
      }

      publish({ error, response });
    };
  }

  private parse(content: any): string | any {
    try {
      return JSON.parse(content);
    } catch (error: any) {
      return content;
    }
  }
}
