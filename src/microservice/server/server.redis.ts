import { createClient, RedisClientType } from 'redis';
import { NO_PATTERN_MESSAGE } from '../constants';

import { MicroserviceConfiguration } from '../interfaces';
import { Server } from './server';

/**
 * Redis Server for Microservices implementation.
 */
export class ServerRedis extends Server {
  private readonly defaultUrl = 'redis://localhost:6379';
  private readonly url: string;

  /**
   * Creates a new instance of the class ServerRedis.
   *
   * @param config Config to be applied.
   */
  constructor(config: MicroserviceConfiguration) {
    super();

    this.url = config.url || this.defaultUrl;
  }

  /**
   * Prepares current server to accept incoming messages.
   *
   * @param callback Action to be executed after initializes.
   */
  listen(callback: () => void) {
    const subscriber = this.createRedisClient();
    const publisher = this.createRedisClient();

    subscriber.on('connect', () => this.handleConnection(callback, subscriber, publisher));
  }

  /**
   * Creates a Redis client type.
   *
   * @returns An instance of a RedisClientType.
   */
  createRedisClient(): RedisClientType {
    return createClient({ url: this.url });
  }

  /**
   * Handle incoming connections and executed given callback.
   *
   * @param callback Callback to be executed.
   * @param subscriber Subscriber stream.
   * @param publisher Publisher stream.
   */
  handleConnection(callback: () => void, subscriber: any, publisher: any) {
    subscriber.on('message', this.getMessageHandler(publisher).bind(this));

    const patterns = Object.keys(this.messageHandlers);
    patterns.forEach((pattern: string) =>
      subscriber.subscribe(this.getAckQueueName(pattern)),
    );
    callback && callback();
  }

  /**
   * Get the message handler for given publisher.
   *
   * @param publisher
   */
  getMessageHandler(publisher: any) {
    return (channel: string, buffer: any) => this.handleMessage(channel, buffer, publisher);
  }

  /**
   * Gets the Acknowledgment Queue name.
   *
   * @param pattern Pattern name;
   *
   * @returns A string value containing the ack queue name.
   */
  getAckQueueName(pattern: string): string {
    return `${pattern}_ack`;
  }

  /**
   * Handle an incoming message.
   *
   * @param channel Channel name.
   * @param buffer Buffer content.
   * @param publisher Publisher stream.
   */
  handleMessage(channel: string, buffer: any, publisher: any) {
    const message = this.tryParse(buffer);
    const pattern = channel.replace(/_ack$/, '');
    const publish = this.getPublisher(publisher, pattern);

    if (!this.messageHandlers[pattern]) {
      publish({ error: NO_PATTERN_MESSAGE });

      return;
    }

    const handler = this.messageHandlers[pattern];
    handler(message.data, this.getMessageHandlerCallback(publisher, pattern).bind(this));
  }

  /**
   * Handle messages with its associated callback.
   *
   * @param publisher Publisher stream.
   * @param pattern Pattern name.
   *
   * @returns A callback to be executed when a message is handled.
   */
  getMessageHandlerCallback(publisher: any, pattern: any) {
    return (error: any, response: any) => {
      const publish = this.getPublisher(publisher, pattern);
      if (!response) {
        publish({
          error: null,
          response: error,
        });

        return;
      }
      publish({
        error,
        response,
      });
    };
  }

  /**
   * Gets current publisher object.
   *
   * @param publisher Publisher stream.
   * @param pattern Pattern name.
   *
   * @returns The publisher object.
   */
  getPublisher(publisher: any, pattern: any): any {
    return (respond: any) => {
      publisher.publish(this.getResQueueName(pattern), JSON.stringify(respond));
    };
  }

  /**
   * Gets the Response Queue name.
   *
   * @param pattern Pattern name;
   *
   * @returns A string value containing the response queue name.
   */
  getResQueueName(pattern: string): string {
    return `${pattern}_res`;
  }

  /**
   * Tries to parse the given content into and object.
   *
   * @param content Content to be parsed.
   *
   * @returns An value containing the parsed content.
   */
  tryParse(content: any): any {
    try {
      return JSON.parse(content);
    } catch (error) {
      return content;
    }
  }
}
