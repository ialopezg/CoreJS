import { Application } from 'express';

/**
 * The application factory is a function that wraps
 * the creation of the main application object and
 * returns it.
 */
export interface ApplicationFactory {
  /**
   * Creates a new instance of the attached object.
   *
   * @param {Application} app Application reference or attached.
   */
  new(app: Application);

  /**
   * Application name.
   */
  name?: string;
}
