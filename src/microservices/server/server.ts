import { LoggerService } from '../../common';

/**
 * Represents a microservices server.
 */
export abstract class Server {
  private readonly logger = new LoggerService(Server.name);

  /**
   * Message handlers.
   *
   * @protected
   */
  protected readonly handlers = {};

  /**
   * Get the current message handler list.
   */
  public getHandlers() {
    return this.handlers;
  }

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
   * @param error Error occurred.
   * @protected
   */
  protected onError(error: any): void {
    this.logger.error(error);
  }
}
