import { Application } from 'express';

/**
 * Main Application Config Resolver.
 */
export class ApplicationConfig {
  /**
   * Prepare the express app with given application object.
   *
   * @param {Application} _app Application to be configured.
   */
  static setup(_app: Application): void {}
}
