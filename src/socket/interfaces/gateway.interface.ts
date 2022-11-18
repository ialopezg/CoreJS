/**
 * Socket gateway.
 */
export interface Gateway {
  /**
   * After init event.
   *
   * @param server Server object.
   */
  afterInit: (server: any) => void;
  /**
   * Handle connection event.
   *
   * @param client Client object.
   */
  handleConnection: (client: any) => void;
  /**
   * Handle disconnect event.
   *
   * @param client Client object.
   */
  handleDisconnect: (client: any) => void;
}
