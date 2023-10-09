import { Module } from '../../../src';
import { SharedModule } from '../shared';
import { UserModule } from '../user';
import { AuthController } from './controllers';

@Module({
  modules: [UserModule, SharedModule],
  controllers: [AuthController],
})
export class AuthModule {
  configure() {
    console.log(`${SharedModule.name} configured!`);
  }
}
