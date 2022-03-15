import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Sequelize } from 'sequelize-typescript';
import { DateTime } from 'luxon';

import { UsersService } from '../users/users.service';
import { UserRole } from '../users/types/user-role.enum';
import { MetadataKey } from '../types/metadata-key.enum';
import { User } from '../users/models/user.model';
import { ApiJwtPayload } from '../types/api-jwt-payload.type';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationToken = JwtService.getAuthorizationToken(AuthGuard.getAuthorizationHeaderFromRequest(request));

    if (!authorizationToken) {
      return false;
    }

    const payload = this.jwtService.getPayloadFromToken(authorizationToken);

    if (!payload) {
      return false;
    }

    if (!AuthGuard.verifyIfSessionValid(payload)) {
      return false;
    }

    try {
      const isAuthorized = await this.sequelize.transaction(async (transaction): Promise<boolean> => {
        const user = await this.usersService.getUserById(transaction, payload.user.id);

        const allowedRoles = this.reflector.get<UserRole[]>(MetadataKey.ALLOWED_ROLES, context.getHandler());

        return user instanceof User && allowedRoles.includes(user.role);
      });

      return isAuthorized;
    } catch (_) {
      return false;
    }
  }

  private static getAuthorizationHeaderFromRequest(request?: { headers?: { authorization?: string } }): string | null {
    return request?.headers?.authorization || null;
  }

  private static verifyIfSessionValid(payload: ApiJwtPayload): boolean {
    const { exp } = payload;
    const now = DateTime.now();
    const expirationDate = DateTime.fromSeconds(exp);
    return expirationDate > now;
  }
}
