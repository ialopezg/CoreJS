import { RuntimeException } from '../../common/exceptions/runtime.exception';

/**
 * Defines an error when the configuration passed in module "configure()" method is wrong.
 */
export class InvalidMiddlewareConfigurationException extends RuntimeException {
  /**
   * Creates a new instance of this class.
   */
  constructor() {
    super('Invalid middleware configuration passed in module "configure()" method!');
  }
}
