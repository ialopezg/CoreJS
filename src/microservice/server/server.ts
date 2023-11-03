/**
 * Represents a microservice server.
 */
export abstract class Server {
  /**
   * Message handlers.
   *
   * @protected
   */
  protected readonly handlers = {};

  /**
   * Initialize the server to start listening request from clients.
   *
   * @param {Function} callback Callback to be executed after start listening.
   */
  abstract listen(callback: () => void);

  /**
   * Add a new patter handler.
   *
   * @param pattern Pattern message.
   * @param {Function} callback Handler callback.
   */
  public add(pattern: any, callback: Function): void {
    this.handlers[JSON.stringify(pattern)] = callback;
  }

  /**
   * Display an error handler.
   *
   * @param error Error ocurred.
   * @protected
   */
  protected error(error: any): void {
    console.error(error);
  }
}
