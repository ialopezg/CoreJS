import { RuntimeException } from './runtime.exception';

/**
 * Represents an error when a circular dependency has been called.
 */
export class CircularDependencyException extends RuntimeException {
  /**
   * Creates a new instance of CircularDependencyException class.
   */
  constructor(target: string) {
    super(`Can't create instance of ${target}. It is possible ` +
            `that you are trying to do circular-dependency A->B, B->A!`);
  }
}
