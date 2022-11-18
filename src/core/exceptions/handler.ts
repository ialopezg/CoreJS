import { Response } from 'express';

import { HttpException } from '../../common';

/**
 * Represents a custom handler for HTTP Exceptions.
 */
export class ExceptionHandler {
  private UNKNOWN_EXCEPTION = 'Unknown exception';

  /**
   * Returns the exception result as a HTTP response.
   *
   * @param exception Exception or error details.
   * @param response Object to be returned with the exception details.
   */
  next(exception: Error | HttpException, response: Response): void {
    if (!(exception instanceof HttpException)) {
      response.status(500).json({ message: this.UNKNOWN_EXCEPTION });

      return;
    }

    response.status(exception.getStatus()).json({
      message: exception.getMessage(),
    });
  }
}
