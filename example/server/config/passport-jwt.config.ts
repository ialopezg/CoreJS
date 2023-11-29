import { Application } from 'express';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import * as passport from 'passport';

import { UserService } from '../modules/user/services';
import { User } from '../modules/user/entities';

export class PassportJwtConfig {
  // private static readonly userService = new UserService({} as any, {} as any);
  public static readonly secretKey = 'XD';

  public static readonly jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: this.secretKey,
  };

  public static setup(app: Application): void {
    this.init();

    app.use(passport.initialize());
  }

  public static init(): void {
    const strategy = new Strategy(
      this.jwtOptions,
      async (payload: any, next) => {
        console.log('Payload received', payload);

        const user = await User.findOne(payload.id);
        console.log(user);

        next(null, user ?? false);
      },
    );
    passport.use(strategy);
  }
}
