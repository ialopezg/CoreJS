import { AppFactory, LoggerService, Transport } from '../../src';
import { MathModule } from './modules/math';

const logger = new LoggerService('Application');

const port = 6379;
const transport = Transport.REDIS
const app = AppFactory.createMicroservice(MathModule, {
  transport: Transport.REDIS,
  url: `redis://localhost:${port}`,
});

app.listen(() => {
  logger.log(`${transport} Microservice is listen on port: ${port}`);
});
