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

    app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

      next();
    });
  }
}
