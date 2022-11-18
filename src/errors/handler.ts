import { LoggerService, RuntimeException } from '../common';

/**
 * Handles error type objects and resolve them according its behaviour.
 */
export class ExceptionHandler {
  private static readonly logger = new LoggerService(ExceptionHandler.name);

  /**
   * Handle given error object.
   *
   * @param exception Error object.
   */
  static handle(exception: Error | RuntimeException): void {
    if (!(exception instanceof RuntimeException)) {
      this.logger.error(exception.message, exception.stack);

      return;
    }

    this.logger.error(exception.getMessage(), exception.stack);
  }
}
