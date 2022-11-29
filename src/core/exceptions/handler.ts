import { Response } from 'express';

import { HttpException, LoggerService } from '../../common';
import { messages } from '../constants';

/**
 * Represents a custom handler for HTTP Exceptions.
 */
export class ExceptionHandler {
  private readonly logger = new LoggerService(ExceptionHandler.name);

  /**
   * Returns the exception result as an HTTP response.
   *
   * @param exception Exception or error details.
   * @param response Object to be returned with the exception details.
   */
  next(exception: Error | HttpException, response: Response): void {
    if (!(exception instanceof HttpException)) {
      response.status(500).json({ message: messages.UNKNOWN_EXCEPTION_MESSAGE });

      this.logger.error(exception.message, exception.stack);

      return;
    }

    response.status(exception.getStatus()).json({
      message: exception.getMessage(),
    });
  }
}
