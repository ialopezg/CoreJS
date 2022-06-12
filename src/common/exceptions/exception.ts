/**
 * Defines a HTTP Exception with status code.
 */
import { HttpStatus } from "../enums";

export class Exception {
  /**
   * Creates a new instance of this class.
   *
   * @param message Descriptive message.
   * @param status Status code.
   */
  constructor(
    private readonly message: string,
    private readonly status: HttpStatus | number,
  ) {}

  /**
   * Gets the descriptive message for this exception.
   *
   * @returns The descriptive message for this exception.
   */
  getMessage(): string {
    return this.message;
  }

  /**
   * Gets the status code for this exception.
   *
   * @returns The status code for this exception.
   */
  getStatus(): number | HttpStatus {
    return this.status;
  }
}
