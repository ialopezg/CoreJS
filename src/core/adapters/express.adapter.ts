import * as express from 'express';

/**
 * Defines an object that creates express based instances.
 */
export class ExpressAdapter {
  /**
   * Creates a new Express instance.
   *
   * @returns The newly created Express instance.
   */
  static create(): any {
    return express();
  }

  /**
   * Creates a new Express Router instance.
   *
   * @returns The newly created Express Router instance.
   */
  static createRouter(): any {
    return express.Router();
  }
}
