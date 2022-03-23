import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Sequelize } from 'sequelize-typescript';

import { UsersService } from '../users/users.service';
import { getAuthHeaderFromContextRequest } from '../helpers/get-auth-header-from-context-request';
import { JwtService } from '../jwt/jwt.service';

// when authorization header is present in the request, it fetches and attaches a user based on the auth header
@Injectable()
export class AddUserToContextMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService, private readonly sequelize: Sequelize) {}

  async use(request: Request & { contextUser: { id?: string } }, res: Response, next: NextFunction) {
    const authHeader = getAuthHeaderFromContextRequest(request);
    if (!authHeader) {
      return next();
    }

    try {
      const userId = JwtService.getUserIdFromJwt(authHeader);
      if (!userId) {
        return next();
      }

      const user = await this.sequelize.transaction(async (transaction) => {
        return await this.usersService.getUserById(transaction, userId);
      });
      if (!user) {
        return next();
      }

      request.contextUser = user;
    } catch (error) {
      return next();
    }

    return next();
  }
}
