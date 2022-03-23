import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import { User } from './models/user.model';
import { UserRole } from './types/user-role.enum';
import NotFoundError from '../error/not-found.error';
import { UserPlace } from './models/user-place.model';
import CRUDError from '../error/crud.error';

@Injectable()
export class UsersService {
  private readonly passwordSalt: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(UserPlace)
    private readonly userPlaceModel: typeof User,
  ) {
    this.passwordSalt = configService.get<string>('API_PASSWORD_SALT', '');
  }

  public async getUserById(transaction: Transaction, id: string): Promise<User | null> {
    try {
      return await this.userModel.findByPk(id, { transaction });
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

  public async assignPlaceToUser(transaction: Transaction, placeId: string, userId: string): Promise<void> {
    try {
      await this.userPlaceModel.create({ userId, placeId }, { transaction });
    } catch (error) {
      throw new NotFoundError('CANNOT_CREATE_ASSIGNMENT');
    }
  }

  public async removePlaceAssignmentFromUser(transaction: Transaction, placeId: string, userId: string): Promise<void> {
    const removedCount = await this.userPlaceModel.destroy({ where: { userId, placeId } });

    if (removedCount === 0) {
      throw new NotFoundError('USER_PLACE_ASSIGNMENT_NOT_FOUND');
    }
  }

  public async getAllUsers(transaction: Transaction): Promise<User[]> {
    return await this.userModel.findAll({ transaction });
  }

  public async removeUserById(transaction: Transaction, id: string): Promise<void> {
    const removedRowsCount = await this.userModel.destroy({ where: { id } });

    if (removedRowsCount === 0) {
      throw new CRUDError('FAILED_TO_REMOVE_USER');
    }
  }
}
