import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { User } from './models/user.model';
import { UserRole } from './types/user-role.enum';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly passwordSalt: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {
    this.passwordSalt = configService.get<string>('API_PASSWORD_SALT', '');
  }

  public async getUserById(transaction: Transaction, id: string): Promise<User | null> {
    try {
      const user = await this.userModel.findByPk(id, { transaction });
      if (!user) {
        return null;
      }

      return user;
    } catch (_) {
      return null;
    }
  }

  public async getUserByLogin(transaction: Transaction, login: string): Promise<User | null> {
    return await this.userModel.findOne({ where: { login }, transaction });
  }

  public async createUser(
    transaction: Transaction,
    userDetails: { login: string; password: string; role: UserRole },
  ): Promise<User | null> {
    const { login, password, role } = userDetails;
    const hashedPassword = await hash(password, this.passwordSalt);
    return await this.userModel.create(
      {
        login,
        hashedPassword,
        role,
      },
      { transaction },
    );
  }
}
