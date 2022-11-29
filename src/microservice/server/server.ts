/**
 * Represents a Microservice Server instance.
 */
export abstract class Server {
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
   * Handle and monitoring given error.
   *
   * @param error Error to be displayed.
   */
  protected handleError(error: any): void {
    console.log(error);
  }

  /**
   * Prepares the server to listen incoming connections.
   *
   * @param callback Action to be deployed after initialization.
   */
  abstract listen(callback: () => void);
}
