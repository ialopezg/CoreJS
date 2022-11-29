import { LoggerService } from '../../common';

/**
 * Microservice Server.
 */
export abstract class Server {
  private readonly logger = new LoggerService(Server.name);

  /**
   * Message collector.
   * @protected
   */
  protected readonly messageHandlers = {};

  /**
   * Add a pattern message.
   *
   * @param pattern Pattern to be added.
   * @param callback Action to be executed.
   */
  add(pattern, callback): void {
    this.messageHandlers[JSON.stringify(pattern)] = callback;
  }

  /**
   * Get current registered handlers.
   *
   * @returns An object with current registered handlers.
   */
  getHandlers(): any {
    return this.messageHandlers;
  }

  /**
   * Handle and monitoring given error.
   *
   * @param error Error to be displayed.
   */
  protected handleError(error: any): void {
    this.logger.error(error);
  }

  /**
   * Prepares the server to listen incoming connections.
   *
   * @param callback Action to be deployed after initialization.
   */
  abstract listen(callback: () => void): void;
}
