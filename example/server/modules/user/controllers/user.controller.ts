import { Request, Response } from 'express';

import { Controller, Get, Post } from '../../../../../src';
import { UserService } from '../services';
import { ModuleRef } from '../../../../../src/core/injector';

@Controller({ path: 'users' })
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly moduleRef: ModuleRef,
  ) {}

  @Post()
  async create(request: Request, response: Response) {
    const user = await this.service.create(request.body);
    if (!user) {
      return response.status(400).json({
        message: 'Error while registering new user!',
      });
    }

    response.status(201).json({ message: 'OK', user });
  }

  @Get()
  async get(_request: Request, response: Response) {
    const users = await this.service.get();

    response.json({ message: 'OK', users });
  }

  @Get('/:id')
  async getById(request: Request, response: Response) {
    const user = await this.service.getById(request.params.id);
    if (!user) {
      return response.status(404).json({
        message: `User with ID ${request.params.id} not found!`,
      });
    }

    response.json({ message: 'OK', user });
  }
}
