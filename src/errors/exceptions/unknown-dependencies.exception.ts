import { RuntimeException } from '../../common/exceptions/runtime.exception';

/**
 * Defines an error when dependency objects are unknown.
 */
export class UnknownDependenciesException extends RuntimeException {
  /**
   * Creates a new instance of this class.
   *
   * @param target Instance with unknown dependencies.
   */
  constructor(target: any) {
    super(`Can't recognize dependencies of ${target.name}.`);
  }
}
