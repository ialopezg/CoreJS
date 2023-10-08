import { Application } from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

/**
 * Express Config Resolver.
 */
export class ExpressConfig {
  /**
   * Prepare the express app with given application object.
   *
   * @param {Application} app Application to be configured.
   */
  static setup(app: Application): void {
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
  }
}
