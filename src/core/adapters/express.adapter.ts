import * as express from 'express';

/**
 * Express adapter factory.
 */
export class ExpressAdapter {
  /**
   * Creates an express instance.
   */
  public static create() {
    return express();
  }

  /**
   * Creates an express router instance.
   */
  public static createRouter() {
    return express.Router();
  }
}
