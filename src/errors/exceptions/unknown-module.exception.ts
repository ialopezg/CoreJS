import { RuntimeException } from '../../common/exceptions/runtime.exception';

/**
 * Defines an error when module specified is not recognized.
 */
export class UnknownModuleException extends RuntimeException {
  /**
   * Creates a new instance of this class.
   */
  constructor() {
    super('Not recognized middleware - Runtime error!');
  }
}
