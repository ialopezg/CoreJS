import { Server } from 'socket.io';

/**
 * Represents a gateway service.
 */
export interface IGateway {
  /**
   * On init event.
   *
   * @param {Server} server Server object
   */
  onInit: (server: Server) => void;
  /**
   * On connection event.
   *
   * @param {any} client Client object.
   */
  connection: (client: any) => void;
}
