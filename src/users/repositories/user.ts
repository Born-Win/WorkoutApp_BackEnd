import { Injectable, Inject } from '@nestjs/common';
import { User } from '../models';

export type UserDataToCreate = Omit<User, 'id'>;

@Injectable()
export class UserRepository {
  constructor(
    @Inject('USER')
    private readonly userModel: typeof User
  ) {}

  async createOne(userData: { email: string; password: string }) {
    return this.userModel.create(userData);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: {
        email
      }
    });
  }

  async findOne(options: Partial<User>): Promise<User | null> {
    return this.userModel.findOne({ where: options });
  }

  async updateById(id: number, data: Partial<UserDataToCreate>) {
    return this.userModel.update(data, { where: { id } });
  }

  async updateOne(params: Partial<User>, data: Partial<UserDataToCreate>) {
    return this.userModel.update(data, { where: params });
  }
}
