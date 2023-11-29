import { UNKNOWN_REQUEST_MAPPING } from '../messages';
import { RuntimeException } from './runtime.exception';

/**
 * Represents an error when cannot found a request mapping entry.
 */
export class UnknownRequestMappingException extends RuntimeException {
  /**
   * Creates a new instance of UnknownRequestMappingException class.
   */
  constructor() {
    super(UNKNOWN_REQUEST_MAPPING);
  }
}
