import { AppModule } from './modules/app';
import { AppFactory, LoggerService } from '../../src';

const logger = new LoggerService('Application');
const port = 3000;
const app = AppFactory.create(AppModule);

app.listen(port, () => {
  logger.log(`Application listen on port: ${port}`);
});
