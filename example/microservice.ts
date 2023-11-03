import { AppFactory, LoggerService, Transport } from '../src';
import { MathModule } from './modules/math';

const logger = new LoggerService('Application');

const port = 5667;
const app = AppFactory.createMicroservice(MathModule, { transport: Transport.TCP, port });
app.listen(() => {
  logger.log(`Application listen on port: ${port}`);
});
