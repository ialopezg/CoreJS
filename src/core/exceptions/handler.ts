import { Response } from 'express';

import { HttpException } from './http-exception';

/**
 * Application error handler.
 */
export class ExceptionHandler {
  private UNKNOWN_EXCEPTION = 'Unknown exception';

  /**
   * On error go to next with error data.
   *
   * @param {Error|HttpException} exception Error occurred.
   * @param {Response} response Response data.
   */
  next(exception: Error | HttpException, response: Response) {
    if (!(exception instanceof HttpException)) {
      return response.status(500).json({ message: this.UNKNOWN_EXCEPTION });
    }

    response.status(exception.status).json({
      message: exception.message,
    });
  }
}
