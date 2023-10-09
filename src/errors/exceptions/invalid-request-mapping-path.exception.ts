import { RuntimeException } from './runtime.exception';

/**
 * Represents an error when the annotation has an invalid path.
 */
export class InvalidRequestMappingPathException extends RuntimeException {
  /**
   * Creates a new instance of InvalidRequestMappingPathException class.
   */
  constructor() {
    super('Invalid path in @RequestMapping() annotation!');
  }
}
