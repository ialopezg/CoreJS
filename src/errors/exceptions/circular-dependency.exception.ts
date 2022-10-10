import { RuntimeException } from '../../common/exceptions/runtime.exception';

/**
 * Defines an error when there is a circular dependency between two objects.
 */
export class CircularDependencyException extends RuntimeException {
  /**
   * Creates a new instance of this class.
   *
   * @param target Instance with the circular dependency.
   */
  constructor(target: any) {
    super(
      `Can't create instance of ${target.name}. It is possible ` +
      'that you are trying to do circular-dependency A->B, B->A.'
    );
  }
}
