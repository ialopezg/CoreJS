import { RuntimeException } from './runtime.exception';
import { getUnknownDependenciesMessage } from '../messages';

/**
 * Represents an error when cannot found a dependency.
 */
export class UnknownDependenciesException extends RuntimeException {
  /**
   * Creates a new instance of the class UnknownModuleException.
   *
   * @param {string} target Dependency type.
   */
  constructor(target: string) {
    super(getUnknownDependenciesMessage(target));
  }
}
