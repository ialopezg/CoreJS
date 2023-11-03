import * as JsonSocket from 'json-socket';
import { createServer, Server as NetSocket } from 'net';

import { Server } from './server';
import { MicroserviceConfiguration } from '../interfaces';
import { NO_PATTERN_MESSAGE } from '../constants';
import { server } from 'sinon';

/**
 * Represents a Server in a TCP microservice.
 */
export class TcpServer extends Server {
  private readonly DEFAULT_PORT = 3000;
  private readonly port: number;
  private server: NetSocket;

  /**
   * Creates a new instance of TcpServer class.
   *
   * @param {MicroserviceConfiguration} config Server configuration.
   */
  constructor(config: MicroserviceConfiguration) {
    super();

    this.port = config.port ?? this.DEFAULT_PORT;

    this.init();
  }

  /**
   * Initializes the microservice to act as a listener server.
   *
   * @param {Function} callback Function to be executed after server starts.
   */
  public listen(callback?: () => void): void {
    this.server.listen(this.port, callback);
  }

  private init(): void {
    this.server = createServer(this.handler.bind(this));
    this.server.on('message', (message) => this.onMessage(server, message))
  }

  private handler(server: any) {
    const socket = new JsonSocket(server);
    socket.on('message', (message) => this.onMessage(socket, message));
  }

  private onMessage(socket: any, message: { pattern: any, data: {} }) {
    const pattern = JSON.stringify(message.pattern);
    if (!this.handlers[pattern]) {
      socket.sendMessage({ error: NO_PATTERN_MESSAGE });

      return;
    }

    this.handlers[pattern](message.data, (error, response) => {
      if (!response) {
        socket.sendMessage({ err: null, response: error });

        return;
      }
    });
  }
}
