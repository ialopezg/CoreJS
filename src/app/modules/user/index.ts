import { Module } from '../../../core/decorators';
import { JwtMiddleware } from '../auth/middlewares';
import { UserController } from './controllers';
import { UserGatewayService, UserService } from './services';

@Module({
  components: [UserService, UserGatewayService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {
  configure(router: any) {
    console.log(`${UserModule.name} configured!`);

    return router.use({
      middlewares: [JwtMiddleware],
      forRoutes: [
        { path: '/users' },
      ],
    });
  }
}
