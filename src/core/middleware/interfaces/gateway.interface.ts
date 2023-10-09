import { Server } from 'socket.io';

/**
 * Represents an SocketIO Server, which manages the WebSocket / HTTP long-polling connections.
 */
export interface IGateway {
  /**
   * Occurs when a SocketIO Server has been initialized.
   * @param server
   */
  onInit: (server: Server) => void;
  /**
   * Occurs when establish a socket connection with client.
   *
   * @param {Server} server SocketIO Server.
   */
  connection: (client: any) => void;
}
