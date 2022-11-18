import { RuntimeException } from '../../common/exceptions';

/**
 * Defines an error when middleware is not recognized.
 */
export class UnknownMiddlewareException extends RuntimeException {
  /**
   * Creates a new instance of this class.
   */
  constructor() {
    super('Not recognized middleware - Runtime error!');
  }
}
