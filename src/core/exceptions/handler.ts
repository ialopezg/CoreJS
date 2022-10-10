import { Response } from 'express';

import { Exception } from './exception';

/**
 * Represents a custom handler for HTTP Exceptions.
 */
export class ExceptionHandler {
  private UNKNOWN_EXCEPTION_MSG = 'Unknown exception';

  /**
   * Returns the exception result as a HTTP response.
   *
   * @param exception Exception or error details.
   * @param response Object to be returned with the exception details.
   */
  next(exception: Exception | Error, response: Response): void {
    if (!(exception instanceof Exception)) {
      response.status(500).json({ message: this.UNKNOWN_EXCEPTION_MSG });

      return;
    }

    response.status(exception.getStatus()).json({
      message: exception.getMessage(),
    });
  }
}
