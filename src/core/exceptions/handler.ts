import { Response } from 'express';

import { Exception } from './exception';

/**
 * Application Error handler.
 */
export class ExceptionHandler {
  private UNKNOWN_EXCEPTION_MESSAGE = 'Unknown exception';

  /**
   * On error go to next with error data.
   *
   * @param {Error|Exception} exception Error occurred.
   * @param {Response} response Response data.
   */
  next(exception: Error | Exception, response: Response) {
    if (!(exception instanceof Exception)) {
      return response.status(500).json({ message: this.UNKNOWN_EXCEPTION_MESSAGE });
    }

    response.status(exception.status).json({
      message: exception.message,
    });
  }
}
