import { HttpStatus } from '../enums';

/**
 * Defines an HTTP HttpException with status code.
 */
export class HttpException {
  /**
   * Creates a new instance of this class.
   *
   * @param message Descriptive message.
   * @param status Status code.
   */
  constructor(
    private readonly message: string = 'Bad Request',
    private readonly status: HttpStatus | number = HttpStatus.BAD_REQUEST,
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
