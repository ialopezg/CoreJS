import { Module } from '../../../src';
import { AuthModule } from '../auth';
import { UserModule } from '../user';
import { ClientController } from './controllers';

@Module({
  modules: [AuthModule, UserModule],
  controllers: [ClientController],
})
export class AppModule {}
