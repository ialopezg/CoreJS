import { RuntimeException } from '../../common/exceptions';
import { INVALID_MIDDLEWARE_CONFIGURATION } from '../messages';

/**
 * Defines an error when the configuration passed in module "configure()" method is wrong.
 */
export class InvalidMiddlewareConfigurationException extends RuntimeException {
  /**
   * Creates a new instance of this class.
   */
  constructor() {
    super(INVALID_MIDDLEWARE_CONFIGURATION);
  }
}
