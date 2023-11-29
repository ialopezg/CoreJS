/**
 * Represents a generic exception.
 */
export class HttpException {
  /**
   * Creates a new instance of the class Exception.
   *
   * @param {string} _message Error message.
   * @param {number} _status Error status code.
   */
  constructor(
    private readonly _message: string,
    private readonly _status: number,
  ) {}

  /**
   * Gets the error message.
   */
  get message(): string {
    return this._message;
  }

  /**
   * Gets the error status code.
   */
  get status(): number {
    return this._status;
  }
}
