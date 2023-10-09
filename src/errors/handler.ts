import { Color } from 'custom-console-colors';
import { RuntimeException } from './exceptions';

/**
 * Handles errors in an exception zone wrapper.
 */
export class ExceptionHandler {
  /**
   * Handle any un-handled error.
   *
   * @param {RuntimeException|Error} exception Error info.
   */
  public handle(exception: RuntimeException | Error) {
    const { red: error, yellow: warning, bold } = Color;

    if (exception instanceof RuntimeException) {
      console.log(bold(error('[CoreJS] Runtime error!')));
      console.log(warning(exception.getMessage()));
    }

    console.log(error('Stack trace:'));
    console.log(exception.stack);
  }
}
