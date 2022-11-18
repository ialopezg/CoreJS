import { RuntimeException } from '../../common/exceptions';
import { getInvalidMiddlewareMessage } from '../messages';

/**
 * Defines an error when middleware not implement the resolve() method or is wrong.
 */
export class InvalidMiddlewareException extends RuntimeException {
  /**
   * Creates a new instance of the class InvalidMiddlewareException.
   */
  constructor(name: string) {
    super(getInvalidMiddlewareMessage(name));
  }
}
