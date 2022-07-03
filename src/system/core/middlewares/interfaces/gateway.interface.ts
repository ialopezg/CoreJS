/**
 * Defines a prototype for Socket Gateway.
 */
export interface Gateway {
  /**
   * OnInit event.
   *
   * @param server Gateway server.
   */
  onInit: (server: any) => void;
  /**
   * Connection event.
   *
   * @param client Gateway client.
   */
  connection: (client: any) => void;
}
