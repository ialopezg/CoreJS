import { MiddlewareBuilder, Module } from '../../../src';
import { JwtMiddleware } from '../auth/middlewares';
import { SharedModule } from '../shared';
import { UserController } from './controllers';
import { ChatService, ChatGatewayService, NotificationService, UserService } from './services';

@Module({
  modules: [SharedModule],
  controllers: [UserController],
  components: [
    UserService,
    ChatGatewayService,
    ChatService,
    NotificationService,
  ],
  exports: [UserService],
})
export class UserModule {
  configure(router: any): MiddlewareBuilder {
    return router.use({
      middlewares: [JwtMiddleware],
      forRoutes: [UserController],
    });
  }
}
