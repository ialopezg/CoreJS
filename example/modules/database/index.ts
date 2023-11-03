import * as mongoose from 'mongoose';
import { ConnectOptions } from 'mongoose';

import { LoggerService } from '../../../src';

const connect = async () => {
  const logger = new LoggerService('Database');

  try {
    const options: ConnectOptions = {
      connectTimeoutMS: 0,
      socketTimeoutMS: 0,
    };

    const connection = await mongoose.connect(
      'mongodb://root:password@localhost:27017/database?authSource=admin',
      options
    );
    if (connection) {
      logger.log('Database Connected Successfully!');
    }
  } catch (error: any) {
    logger.error('Error while connecting database', error);
  }
};
void connect();

export { mongoose as db };
