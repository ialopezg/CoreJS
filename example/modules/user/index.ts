import { MiddlewareBuilder, Module } from '../../../src';
import { JwtMiddleware } from '../auth/middlewares';
import { SharedModule } from '../shared';
import { UserController } from './controllers';
import { UserGatewayService, UserService } from './services';

@Module({
  modules: [SharedModule],
  controllers: [UserController],
  components: [UserService, UserGatewayService],
  exports: [UserService],
})
export class UserModule {
  configure(router: any): MiddlewareBuilder {
    console.log(`${UserModule.name} configured!`);

    return router.use({
      middlewares: [JwtMiddleware],
      forRoutes: [UserController],
    });
  }
}
