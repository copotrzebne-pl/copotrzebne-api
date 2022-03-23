import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ContextRequestWithUser } from '../types/context-request-with-user.type';
import { User } from '../users/models/user.model';

export const SessionUser = createParamDecorator((data: unknown, ctx: ExecutionContext): User | null => {
  const request = ctx.switchToHttp().getRequest<ContextRequestWithUser>();
  return request.contextUser || null;
});
