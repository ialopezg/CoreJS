import { NextFunction, Request, Response } from 'express';

import { Controller, Path } from '../../../../core/decorators';
import { RequestMethod } from '../../../../core/enums';
import { UserService } from '../services';

@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly service: UserService) {}

  @Path({
    path: '/',
    method: RequestMethod.GET,
  })
  async get(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await this.service.get();

      response.status(200).json(users);
    } catch (error: any) {
      next(error.message);
    }
  }
}
