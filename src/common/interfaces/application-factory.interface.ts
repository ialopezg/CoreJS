import * as express from 'express';

/**
 * Application Factory prototype.
 */
export interface ApplicationFactory {
  /**
   * Application constructor.
   */
  new (app: express.Application);
}
