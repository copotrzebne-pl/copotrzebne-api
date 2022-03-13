import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

import { ApiJwtPayload } from '../types/api-jwt-payload.type';
import { User } from '../users/models/user.model';
import { Transaction } from 'sequelize';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthenticationService {
  private readonly jwtSignature: string;

  constructor(private readonly configService: ConfigService, private readonly usersService: UsersService) {
    this.jwtSignature = configService.get<string>('API_JWT_SIGNATURE', '');
  }

  public async createSessionOrFail(
    transaction: Transaction,
    loginDetails: { login: string; password: string },
  ): Promise<string> {
    const { login, password } = loginDetails;

    const user = await this.usersService.getUserByLogin(transaction, login);
    if (!user) {
      throw new Error('FAILED_TO_LOGIN');
    }

    const passwordVerified = await AuthenticationService.verifyPassword(password, user.hashedPassword);
    if (!passwordVerified) {
      throw new Error('FAILED_TO_LOGIN');
    }

    return this.generateJWT(user);
  }

  private static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  private generateJWT(user: User): string {
    const expirationDate = DateTime.now().plus({ days: 30 }).toMillis();
    const payload: ApiJwtPayload = { user: { id: user.id }, exp: expirationDate };
    return sign(payload, this.jwtSignature);
  }
}
