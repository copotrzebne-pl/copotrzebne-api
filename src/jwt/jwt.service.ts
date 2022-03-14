import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import { ApiJwtPayload } from '../types/api-jwt-payload.type';

@Injectable()
export class JwtService {
  private readonly jwtSignature: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtSignature = this.configService.get<string>('API_JWT_SIGNATURE', '');
  }

  public getAuthorizationToken(authorizationString: string | null): string | null {
    if (!authorizationString || !authorizationString.startsWith('Bearer ')) {
      return null;
    }

    const token = authorizationString.split(' ')[1];
    if (!token) {
      return null;
    }

    return token;
  }

  public getPayloadFromToken(token: string): ApiJwtPayload | null {
    try {
      return verify(token, this.jwtSignature) as ApiJwtPayload;
    } catch (_) {
      return null;
    }
  }

  public generateJwt(payload: Omit<ApiJwtPayload, 'exp'>): string {
    return sign(payload, this.jwtSignature, { expiresIn: '30d' });
  }
}
