import { RuntimeException } from '../../common/exceptions';
import { getUnkownDependenciesMessage } from '../messages';

/**
 * Defines an error when dependency objects are unknown.
 */
export class UnknownDependenciesException extends RuntimeException {
  /**
   * Creates a new instance of this class.
   *
   * @param target Instance with unknown dependencies.
   */
  constructor(target: string) {
    super(getUnkownDependenciesMessage(target));
  }
}
