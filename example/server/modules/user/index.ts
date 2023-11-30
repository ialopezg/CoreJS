import { MiddlewareBuilder, Module, MergeWithValues } from '../../../../src';
import { JwtMiddleware } from '../auth/middlewares';
import { SharedModule } from '../shared';
import { UserController } from './controllers';
import { UserService } from './services';

const ProvideRoles = MergeWithValues({
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

  configure(builder: MiddlewareBuilder): MiddlewareBuilder {
    return builder
      .apply(JwtMiddleware)
      .with('admin', 'creator', 'editor')
      .forRoutes(UserController);
  }
}
