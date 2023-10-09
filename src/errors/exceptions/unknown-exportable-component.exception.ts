import { RuntimeException } from './runtime.exception';

/**
 * Represents an error when cannot found an exportable component.
 */
export class UnknownExportableComponentException extends RuntimeException {
  /**
   * Creates a new instance of UnknownExportableComponentException class.
   */
  constructor(component: string) {
    super(`Unknown ${component} component. Maybe ` +
      `you forgot to place this one to components list also!`);
  }
}
