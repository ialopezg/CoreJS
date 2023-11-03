import { AppModule } from './modules/app';
import { AppFactory, LoggerService } from '../src';
import { Application } from 'express';

const logger = new LoggerService('Application');
const port = 3000;
const app = AppFactory.create(AppModule);

const server = app.listen(port, () => {
  logger.log(`Application listen on port: ${port}`);
});
