import { getUnknownExportMessage } from '../messages';
import { RuntimeException } from './runtime.exception';

/**
 * Represents an error when cannot found an exportable component.
 */
export class UnknownExportableComponentException extends RuntimeException {
  /**
   * Creates a new instance of UnknownExportableComponentException class.
   */
  constructor(component: string) {
    super(getUnknownExportMessage(component));
  }
}
