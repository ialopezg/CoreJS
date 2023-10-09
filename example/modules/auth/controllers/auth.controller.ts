import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { Controller, RequestMapping } from '../../../../src/common/decorators';
import { UserService } from '../../user/services';
import { RequestMethod } from '../../../../src/common/enums';
import { PassportJwtConfig } from '../../../config/passport-jwt.config';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @RequestMapping({ path: 'register', method: RequestMethod.POST })
  async register(request: Request, response: Response) {
    const user = await this.userService.create(request.body);
    if (!user) {
      return response.status(400).json({
        message: 'Error while registering new user!',
      });
    }

    response.json({ message: 'Ok', user });
  }

  @RequestMapping({ path: 'login', method: RequestMethod.POST })
  async login(req: Request, response: Response, next: NextFunction) {
    const { username, password } = req.body;

    const user = await this.userService.getByUsername(username);
    if (!user || user.password !== password) {
      return response.status(401).json({
        message: 'Wrong credentials provided!',
      });
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, PassportJwtConfig.secretKey);
    response.json({ message: 'Ok', token });
  }
}
