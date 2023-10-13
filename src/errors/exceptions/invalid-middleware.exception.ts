import { getInvalidMiddlewareMessage } from '../messages';
import { RuntimeException } from './runtime.exception';

/**
 * Represents an error when a middleware object is invalid.
 */
export class InvalidMiddlewareException extends RuntimeException {
  /**
   * Creates a new instance of the class InvalidMiddlewareException.
   */
  constructor(middleware: string) {
    super(getInvalidMiddlewareMessage(middleware));
  }
}
