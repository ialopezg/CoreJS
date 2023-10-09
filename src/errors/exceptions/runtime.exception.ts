/**
 * Represents a runtime error.
 *
 * This class will be inherited by all kinds of errors.
 */
export class RuntimeException extends Error {
  /**
   * Creates a new instance of the class RuntimeException.
   *
   * @param {string} _message Error message.
   */
  constructor(private readonly _message?: string) {
    super();
  }

  /**
   * Gets the error message.
   */
  public getMessage(): string {
    return this._message;
  }
}
