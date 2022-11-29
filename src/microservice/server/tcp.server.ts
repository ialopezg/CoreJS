import * as JsonSocket from 'json-socket';
import { createServer, Server as NetServer } from 'net';
import { NO_MESSAGE_PATTERN } from '../constants';

import { MicroserviceConfiguration } from '../interfaces';
import { Server } from './server';

/**
 * Represents a TCP Server for Microservices implementation
 */
export class TCPServer extends Server {
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
   * Initializes this TCP Server.
   */
  private init(): void {
    this.server = createServer(this.bindHandler.bind(this));
    this.server.on('error', this.handleError.bind(this));
  }

  /**
   * Bind socket server to listen incoming connections.
   *
   * @param socket Server Socket
   */
  private bindHandler(socket) {
    const jsonSocket = new JsonSocket(socket);
    jsonSocket.on('message', (message: any) =>
      this.handleMessage(jsonSocket, message),
    );
  }

  /**
   * Handle message patterns.
   *
   * @param socket Server socket.
   * @param message Message to be processed.
   */
  private handleMessage(socket: any, message: { pattern: any; data: {} }): void {
    const pattern = JSON.stringify(message.pattern);
    if (!this.messageHandlers[pattern]) {
      socket.sendMessage({ error: NO_MESSAGE_PATTERN });

      return;
    }

    this.messageHandlers[pattern](message.data, (error: any, response: any) => {
      if (!response) {
        socket.sendMessage({ err: null, response: error });

        return;
      }
      socket.sendMessage({ error, response });
    });
  }
}
