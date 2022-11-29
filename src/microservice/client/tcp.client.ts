import * as jsonSocket from 'json-socket';

import { ClientMetadata } from '../interfaces';
import { ProxyClient } from './proxy.client';

/**
 * TCP Client instance.
 */
export class TCPClient extends ProxyClient {
  private readonly defaultHost = 'localhost';
  private readonly defaultPort = 3000;
  private readonly host: string;
  private readonly port: number;

  /**
   * Creates a new instance of ClientTcp class with given configuration.
   *
   * @param config Client metadata information.
   */
  constructor({ port, host }: ClientMetadata) {
    super();

    this.host = host || this.defaultHost;
    this.port = port || this.defaultPort;
  }

  /**
   * Sends a single message with given parameters.
   *
   * @param message Message to be sent.
   * @param callback Function to be executed.
   */
  sendSingleMessage(message: any, callback: Function): void {
    jsonSocket.sendSingleMessageAndReceive(this.port, this.host, message, (error: any, response: any) => {
      if (error) {
        callback(error);

        return;
      }

      callback(response.error, response.response);
    });
  }
}
