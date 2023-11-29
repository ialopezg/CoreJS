import { MiddlewareBuilder, Module, ProvideValues } from '../../../../src';
import { JwtMiddleware } from '../auth/middlewares';
import { SharedModule } from '../shared';
import { UserController } from './controllers';
import { UserService } from './services';

const ProvideRoles = ProvideValues({
  role: ['admin', 'user']
});

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
      middlewares: [ProvideRoles(JwtMiddleware)],
      forRoutes: [UserController],
    });
  }
}
