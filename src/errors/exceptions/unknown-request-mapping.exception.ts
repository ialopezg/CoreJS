import { RuntimeException } from '../../common/exceptions/runtime.exception';

/**
 * Defines an error when module specified is not recognized.
 */
export class UnknownRequestMappingException extends RuntimeException {
  /**
   * Creates a new instance of this class.
   */
  constructor() {
    super('RequestMapping not defined in @RequestMapping() annotation!');
  }
}
