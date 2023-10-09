import { NextFunction, Request, Response } from 'express';

import { Controller, RequestMapping } from '../../../../core/decorators';
import { RequestMethod } from '../../../../core/enums';
import { UserService } from '../services';

@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly service: UserService) {}

  @RequestMapping({
    path: '/',
    method: RequestMethod.GET,
  })
  async create(request: Request, response: Response) {
    const user = await this.service.create(request.body);
    if (!user) {
      return response.status(400).json({
        message: 'Error while registering new user!',
      });
    }

    response.status(201).json({ message: 'OK', user });
  }

  @RequestMapping({
    path: '/',
    method: RequestMethod.GET,
  })
  async get(request: Request, response: Response) {
    const users = await this.service.get();

    response.json({ message: 'OK', users });
  }

  @RequestMapping({
    path: '/:id',
    method: RequestMethod.GET,
  })
  async getById(request: Request, response: Response, next: NextFunction) {
    const user = await this.service.getById(request.params.id);
    if (!user) {
      return response.status(404).json({
        message: `User with ID ${request.params.id} not found!`,
      });
    }

    response.json({ message: 'OK', user });
  }
}
