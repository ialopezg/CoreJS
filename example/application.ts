import * as express from 'express';

import { IApplication } from '../src/common/interfaces';
import { ApplicationConfig, ExpressConfig } from './config';
import { PassportJwtConfig } from './config/passport-jwt.config';

export class Application implements IApplication {
  constructor(private readonly app: express.Express) {
    ExpressConfig.setup(app);
    PassportJwtConfig.setup(app);
    ApplicationConfig.setup(app);
  }

  start() {
    const port = 3000;

    console.log('Application starting!');
    this.app.listen(port, () => console.log(`Application listen on port: ${port}`));
  }
}
