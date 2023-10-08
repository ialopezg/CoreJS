import * as mongoose from 'mongoose';
import { ConnectOptions } from 'mongoose';

const connect = async () => {
  try {
    const options: ConnectOptions = {};

    const connection = await mongoose.connect('mongodb://root:password@localhost:27017/database?authSource=admin', options);
    if (connection) {
      console.log('\x1b[32m%s\x1b[0m', 'Database Connected Successfully...');
    }
  } catch (error: any) {
    console.log('\x1b[31m%s\x1b[0m', 'Error while connecting database\n');
    console.log(error);
  }
};
void connect();

export { mongoose as db };