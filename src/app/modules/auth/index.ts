import { Module } from '../../../core/decorators';
import { SharedModule } from '../shared';
import { UserModule } from '../user';
import { AuthController } from './controllers';

@Module({
  modules: [UserModule, SharedModule],
  controllers: [AuthController],
})
export class AuthModule {
  configure() {
    console.log(`${AuthModule.name} configured`);
  }
}
