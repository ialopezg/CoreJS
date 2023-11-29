import { LoggerService } from '../common';
import { RuntimeException } from './exceptions';

/**
 * Handles error type objects and resolve them according its behaviour.
 */
export class ExceptionHandler {
  private logger: LoggerService;

  /**
   * Handle given error object.
   *
   * @param exception Error object.
   */
  public handle(exception: Error | RuntimeException): void {
    this.logger = new LoggerService(ExceptionHandler.name);

    if (!(exception instanceof RuntimeException)) {
      this.logger.error(exception.message, exception.stack);

      return;
    }

    this.logger.error(exception.getMessage(), exception.stack);
  }
}
