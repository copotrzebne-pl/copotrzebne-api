import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Sequelize } from 'sequelize';
import { verify } from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';
import { UserRole } from '../users/types/user-role.enum';
import { MetadataKey } from '../types/metadata-key.enum';
import { User } from '../users/models/user.model';
import { ApiJwtPayload } from '../types/api-jwt-payload.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly sequelize: Sequelize,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationToken = AuthGuard.getAuthorizationToken(AuthGuard.getAuthorizationHeaderFromRequest(request));

    if (!authorizationToken) {
      return false;
    }

    const payload = AuthGuard.getPayloadFromToken(
      authorizationToken,
      this.configService.get<string>('API_JWT_SIGNATURE', ''),
    );

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

  private static getAuthorizationToken(authorizationString: string | null): string | null {
    if (!authorizationString || !authorizationString.startsWith('Bearer ')) {
      return null;
    }

    const token = authorizationString.split(' ')[1];
    if (!token) {
      return null;
    }

    return token;
  }

  private static getPayloadFromToken(token: string, signature: string): ApiJwtPayload | null {
    try {
      return verify(token, signature) as ApiJwtPayload;
    } catch (_) {
      return null;
    }
  }

  private static verifyIfSessionValid(payload: ApiJwtPayload): boolean {
    const { exp } = payload;
    const now = DateTime.now();
    const expirationDate = DateTime.fromMillis(exp);
    return expirationDate > now;
  }
}
