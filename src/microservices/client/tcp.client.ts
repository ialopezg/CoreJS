import * as JsonSocket from 'json-socket';

import { ClientProxy } from './proxy';
import { ClientMetadata } from '../interfaces';

/**
 * Represents a TCP Client.
 */
export class TcpClient extends ClientProxy {
  private readonly DEFAULT_HOST = 'localhost';
  private readonly DEFAULT_PORT = 3000;
  private readonly host: string;
  private readonly port: number;

  /**
   * Creates a new instance of TcpClient class.
   * @param {string} host Hostname
   * @param {string} port Port number.
   */
  constructor({ host, port }: ClientMetadata) {
    super();

    this.host = host ?? this.DEFAULT_HOST;
    this.port = port ?? this.DEFAULT_PORT;
  }

  /**
   * Sends a single message.
   *
   * @param message Message pattern.
   * @param {Function} callback Callback to be executed after send the message.
   */
  sendSingleMessage(message: any, callback: Function): void {
    JsonSocket.sendSingleMessageAndReceive(
      this.port,
      this.host,
      message,
      this.createCallback(callback),
    )
  }

  private createCallback(callback: Function) {
    return (error: any, res: any) => {
      if (error) {
        return callback(error);
      }

      callback(res.error, res.response);
    };
  }
}
