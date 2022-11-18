import { RuntimeException } from '../../common/exceptions';
import { UNKOWN_REQUEST_MAPPING } from '../messages';

/**
 * Defines an error when module specified is not recognized.
 */
export class UnknownRequestMappingException extends RuntimeException {
  /**
   * Creates a new instance of this class.
   */
  constructor() {
    super(UNKOWN_REQUEST_MAPPING);
  }
}
