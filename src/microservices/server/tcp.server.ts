import * as JsonSocket from 'json-socket';
import { createServer, Server as NetSocket } from 'net';

import { Server } from './server';
import { MicroserviceConfiguration } from '../interfaces';
import { NO_PATTERN_MESSAGE } from '../constants';

/**
 * Represents a Server in a TCP microservices.
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
   * Initializes the microservices to act as a listener server.
   *
   * @param {Function} callback Function to be executed after server starts.
   */
  public listen(callback?: () => void): void {
    this.server.listen(this.port, callback);
  }

  private init(): void {
    this.server = createServer(this.setHandler.bind(this));
    this.server.on('error', this.onError.bind(this));
  }

  private onMessage(socket: any, message: { pattern: any, data: {} }) {
    const pattern = JSON.stringify(message.pattern);
    if (!this.handlers[pattern]) {
      return socket.sendMessage({ error: NO_PATTERN_MESSAGE });
    }

    const handler = this.handlers[pattern];
    handler(message.data, this.getMessageHandler(socket));
  }

  getSocketInstance(socket: any): any {
    return new JsonSocket(socket);
  }

  private getMessageHandler(socket: any): Function {
    return (error: any, response: any) => {
      if (!response) {
        socket.sendMessage({ err: null, response: error });

        return;
      }

      socket.sendMessage({ error, response });
    }
  }

  private setHandler(server: any): void {
    const socket = this.getSocketInstance(server);
    socket.on('message', (message: any) => this.onMessage(socket, message));
  }
}
