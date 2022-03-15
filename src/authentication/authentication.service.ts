import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { Transaction } from 'sequelize';

import { ApiJwtPayload } from '../types/api-jwt-payload.type';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthenticationService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

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
    const payload: Omit<ApiJwtPayload, 'exp'> = { user: { id: user.id } };
    return this.jwtService.generateJwt(payload);
  }
}
