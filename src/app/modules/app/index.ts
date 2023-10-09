import { Module } from '../../../core/decorators';
import { AuthModule } from '../auth';
import { UserModule } from '../user';

@Module({
  modules: [AuthModule, UserModule],
})
export class AppModule {
  configure() {
    console.log(`${UserModule.name} configured`);
  }
}
