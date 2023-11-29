import { ExceptionHandler } from './handler';
import { RuntimeException } from './exceptions';

/**
 * Exception Wrapper.
 */
export class ExceptionWrapper {
  private static readonly handler = new ExceptionHandler();

  /**
   * Runs a function into a safe wrapper.
   *
   * @param {() => void} callback Process or function to be run.
   */
  public static run(callback: () => void): void {
    try {
      callback();
    } catch (error: any) {
      this.handler.handle(error);

      throw error;
    }
  }
}
