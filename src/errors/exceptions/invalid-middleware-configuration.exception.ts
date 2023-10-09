import { RuntimeException } from './runtime.exception';

/**
 * Represents an error when a middleware object is not properly configured.
 */
export class InvalidMiddlewareConfigurationException extends RuntimeException {
  /**
   * Creates a new instance of InvalidMiddlewareConfigurationException class.
   */
  constructor() {
    super('Invalid middleware configuration passed in the module "configure()" method!');
  }
}
