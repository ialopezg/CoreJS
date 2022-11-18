import { ExceptionHandler } from './handler';

/**
 * Represents an error wrapper.
 */
export class ExceptionWrapper {
  /**
   * Runs applications or functions in a safe area.
   *
   * @param callback Callback to be checked by this wrapper.
   */
  static run(callback: () => void): void {
    try {
      callback();
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
