import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  public async getUserById(transaction: Transaction, id: string): Promise<User | null> {
    const user = await this.userModel.findByPk(id, { transaction });

    if (!user) {
      return null;
    }

    return user;
  }
}
