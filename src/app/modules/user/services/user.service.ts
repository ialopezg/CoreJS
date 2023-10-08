import { Component } from '../../../../core/decorators';
import { User } from '../entities';

@Component()
export class UserService {
  public async get(): Promise<any> {
    return new Promise((resolve) => {
      resolve(User.find({}));
    });
  }
}
