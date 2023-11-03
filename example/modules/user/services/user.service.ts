import { Subject } from 'rxjs';

import { Component } from '../../../../src';
import { User } from '../entities';
import { SharedService } from '../../shared/services';
import { ChatGatewayService } from './chat-gateway.service';

@Component()
export class UserService {
  public stream$ = new Subject<string>();

  static get dependencies() {
    return [ChatGatewayService, SharedService];
  }

  constructor(
    private readonly gatewayService: ChatGatewayService,
    private readonly sharedService: SharedService,
  ) {
    this.sharedService.stream$?.subscribe((xd) => {
      this.stream$.next(xd);
    });
  }

  public async create(userCreateDto: any) {
    return new Promise(async (resolve) => {
      const user = new User(userCreateDto);
      await user.save();

      resolve(user);
    });
  }

  public async get() {
    return new Promise((resolve) => {
      resolve(User.find({}));
    });
  }

  public async getById(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error(`Given User ID ${id} is not valid!`);
    }

    return User.findById(id);
  }

  public async getByUsername(username: string) {
    return User.findOne({ username });
  }
}
