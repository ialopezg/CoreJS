import { createClient } from 'redis';
import { NO_MESSAGE_PATTERN } from '../constants';

import { MicroserviceConfiguration } from '../interfaces';
import { Server } from './server';

/**
 * Redis Server for Microservices implementation.
 */
export class RedisServer extends Server {
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
    const subscriber = createClient({ url: this.url });
    const publisher = createClient({ url: this.url });

    subscriber.on('connect', () => this.handleConnection(callback, subscriber, publisher));
  }

  /**
   * Handle incoming connections and executed given callback.
   *
   * @param callback Callback to be executed.
   * @param subscriber Subscriber stream.
   * @param publisher Publisher stream.
   */
  private handleConnection(callback: () => void, subscriber: any, publisher: any) {
    subscriber.on('message', (channel: any, buffer: any) =>
      this.handleMessage(channel, buffer, publisher),
    );

    const patterns = Object.keys(this.messageHandlers);
    patterns.forEach((pattern: string) =>
      subscriber.subscribe(this.getAckQueueName(pattern)),
    );
    callback && callback();
  }

  /**
   * Gets the Ack Queue name.
   *
   * @param pattern Pattern name;
   *
   * @returns A string value containing the ack queue name.
   */
  private getAckQueueName(pattern: string): string {
    return `${pattern}_ack`;
  }

  /**
   * Handle an incoming message.
   *
   * @param channel Channel name.
   * @param buffer Buffer content.
   * @param publisher Publisher stream.
   */
  private handleMessage(channel: string, buffer: any, publisher: any) {
    const message = this.tryParse(buffer);
    const pattern = channel.replace(/_ack$/, '');
    const publish = this.getPublisher(publisher, pattern);

    if (!this.messageHandlers[pattern]) {
      publish({ error: NO_MESSAGE_PATTERN });

      return;
    }

    const handler = this.messageHandlers[pattern];
    handler(message.data, this.handleMessageCallback(publisher, pattern).bind(this));
  }

  /**
   * Handle messages with its associated callback.
   *
   * @param publisher Publisher stream.
   * @param pattern Pattern name.
   *
   * @returns A callback to be executed when a message is handled.
   */
  handleMessageCallback(publisher: any, pattern: any): any {
    return (error: any, response: any) => {
      const publish = this.getPublisher(publisher, pattern);
      if (!response) {
        const respond = error;
        publish({
          error: null,
          respond: response,
        });

        return;
      }
      publish(error, response);
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
  private getPublisher(publisher: any, pattern: any): any {
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
  private getResQueueName(pattern: string): string {
    return `${pattern}_res`;
  }

  /**
   * Tries to parse the given content into and object.
   *
   * @param content Content to be parsed.
   *
   * @returns An value containing the parsed content.
   */
  private tryParse(content: any): any {
    try {
      return JSON.parse(content);
    } catch (error) {
      return content;
    }
  }
}
