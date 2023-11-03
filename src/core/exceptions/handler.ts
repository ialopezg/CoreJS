import { Response } from 'express';

import { HttpException } from './http-exception';
import { messages } from '../constants';
import { LoggerService } from '../../common';

/**
 * Application error handler.
 */
export class ExceptionHandler {
  private readonly logger = new LoggerService(ExceptionHandler.name);

  /**
   * On error go to next with error data.
   *
   * @param {Error|HttpException} exception Error occurred.
   * @param {Response} response Response data.
   */
  next(exception: Error | HttpException, response: Response) {
    if (!(exception instanceof HttpException)) {
      this.logger.error(exception.message, exception.stack);

      return response.status(500).json({
        message: messages.UNKNOWN_EXCEPTION,
      });
    }

    response.status(exception.status).json({
      message: exception.message,
    });
  }
}
