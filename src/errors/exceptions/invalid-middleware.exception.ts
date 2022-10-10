import { RuntimeException } from '../../common/exceptions/runtime.exception';

/**
 * Defines an error when middleware has not "resolve()" method or is wrong.
 */
export class InvalidMiddlewareException extends RuntimeException {
  /**
   * Creates a new instance of this class.
   */
  constructor() {
    super('You are trying to setup middleware without "resolve()" method!');
  }
}
