import * as express from 'express';
import { Application, Router } from "express";

/**
 * Express adapter factory.
 */
export class ExpressAdapter {
  /**
   * Creates an express instance.
   */
  public static create(): Application {
    return express();
  }

  /**
   * Creates an express router instance.
   */
  public static createRouter(): Router {
    return express.Router();
  }
}
