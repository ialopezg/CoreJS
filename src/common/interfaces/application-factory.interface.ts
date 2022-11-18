import { Application } from 'express';

/**
 * Defines a prototype for App objects.
 */
export interface ApplicationFactory {
  /**
   * Constructor method.
   *
   * @param app Express application to be implemented.
   */
  new(app: Application);

  /**
   * Application name.
   */
  name?: string;
}
