import * as JsonSocket from 'json-socket';
import { createServer, Server as NetServer } from 'net';
import { NO_PATTERN_MESSAGE } from '../constants';

import { MicroserviceConfiguration } from '../interfaces';
import { Server } from './server';

/**
 * Represents a TCP Server for Microservices implementation
 */
export class ServerTCP extends Server {
  private readonly defaultPort = 3000;
  private readonly port: number;
  private server: NetServer;

  constructor(config: MicroserviceConfiguration) {
    super();

    this.port = config.port || this.defaultPort;
    this.init();
  }

  /**
   * Get ready current server to listen incoming messages patterns.
   *
   * @param callback Action to be deployed after initializes.
   */
  listen(callback: () => void) {
    this.server.listen(this.port, callback);
  }

  /**
   * Bind socket server to listen incoming connections.
   *
   * @param socket Server Socket
   */
  bindHandler(socket: any) {
    const jSocket = this.getSocketInstance(socket);
    jSocket.on('message', (message: any) =>
      this.handleMessage(jSocket, message),
    );
  }

  /**
   * Creates a new JsonSocket with given server socket.
   *
   * @param socket Server socket.
   *
   * @returns An instance of JsonSocket.
   */
  getSocketInstance(socket: any) {
    return new JsonSocket(socket);
  }

  /**
   * Handle message patterns.
   *
   * @param socket Server socket.
   * @param message Message to be processed.
   */
  handleMessage(socket: any, message: { pattern: any; data: {} }): void {
    const pattern = JSON.stringify(message.pattern);
    if (!this.messageHandlers[pattern]) {
      socket.sendMessage({ error: NO_PATTERN_MESSAGE });

      return;
    }

    const handler = this.messageHandlers[pattern];
    handler(message.data, this.getMessageHandler(socket));
  }

  /**
   * Get the message handler for given socket.
   *
   * @param socket Server socket.
   *
   * @returns A function callback with handler requested.
   */
  getMessageHandler(socket: any): any {
    return (error: any, response: any) => {
      if (!response) {
        socket.sendMessage({
          error: null,
          response: error,
        });

        return;
      }

      socket.sendMessage({
        error,
        response,
      });
    };
  }

  /**
   * Initializes this TCP Server.
   */
  private init(): void {
    this.server = createServer(this.bindHandler.bind(this));
    this.server.on('error', this.handleError.bind(this));
  }
}
