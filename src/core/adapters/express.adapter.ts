import * as express from 'express';

/**
 * Express adapter factory.
 */
export class ExpressAdapter {
  /**
   * Creates an express instance.
   */
  static create() {
    return express();
  }

  /**
   * Creates an express router instance.
   */
  static createRouter(): express.Router {
    return express.Router();
  }
}
