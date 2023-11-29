import { MiddlewareBuilder, Module } from '../../../../src';
import { JwtMiddleware } from '../auth/middlewares';
import { SharedModule } from '../shared';
import { UserController } from './controllers';
import { UserService } from './services';

@Module({
  modules: [SharedModule],
  controllers: [UserController],
  components: [UserService],
  exports: [UserService],
})
export class UserModule {
  public getContext() {
    return 'Test';
  }

  configure(router: any): MiddlewareBuilder {
    return router.use({
      middlewares: [JwtMiddleware],
      forRoutes: [UserController],
    });
  }
}
