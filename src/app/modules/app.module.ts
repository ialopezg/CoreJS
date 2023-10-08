import { Module } from '../../core/decorators';
import { UserModule } from './user';

@Module({
  modules: [UserModule],
})
export class AppModule {}
