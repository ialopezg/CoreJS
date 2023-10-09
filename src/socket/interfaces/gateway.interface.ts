import { Server } from 'socket.io';

/**
 * Represents a gateway service.
 */
export interface IGateway {
  /**
   * After init event.
   *
   * @param {Server} server Server object
   */
  afterInit: (server: Server) => void;
  /**
   * Handle connection event.
   *
   * @param {any} client Client object.
   */
  handleConnection: (client: any) => void;
  /**
   * Handle disconnect event.
   *
   * @param {any} client Client object.
   */
  handleDisconnect: (client: any) => void;
}
