import { Module } from '../../../core/decorators';
import { UserGatewayService, UserService } from './services';
import { UserController } from './controllers';

@Module({
  components: [UserService, UserGatewayService],
  controllers: [UserController],
})
export class UserModule {}