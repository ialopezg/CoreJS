import { Component } from '../../../../core/decorators';
import { User } from '../entities';

@Component()
export class UserService {
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
