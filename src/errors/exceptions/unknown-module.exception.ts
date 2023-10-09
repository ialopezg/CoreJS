import { RuntimeException } from './runtime.exception';

/**
 * Represents an error when cannot found a pre-registered module.
 */
export class UnknownModuleException extends RuntimeException {
  /**
   * Creates a new instance of UnknownModuleException class.
   */
  constructor(module: string) {
    super(`Runtime Error - Module ${module} not found!`);
  }
}
