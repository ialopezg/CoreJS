import { RuntimeException } from './runtime.exception';

/**
 * Represents an error when cannot found middleware.
 */
export class UnknownMiddlewareException extends RuntimeException {
  /**
   * Creates a new instance of the class UnknownMiddlewareException.
   */
  constructor() {
    super(`Runtime Error - Unknown middleware!`);
  }
}
