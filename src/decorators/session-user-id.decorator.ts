import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';

export const SessionUserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const authHeader = request?.headers?.authorization;
  const userId = JwtService.getUserIdFromJwt(authHeader);

  return userId;
});
