import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ServerResponse, IncomingMessage } from 'http';

import { getAuthHeaderFromContextRequest } from '../helpers/get-auth-header-from-context-request';

@Injectable()
export class AddCacheHeaderToResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response: ServerResponse = context.switchToHttp().getResponse();
    const request: IncomingMessage = context.switchToHttp().getRequest();

    const hasAuthHeader = getAuthHeaderFromContextRequest(request) !== null;

    response.setHeader('Vary', 'Origin, Authorization');
    response.setHeader('Cache-Control', hasAuthHeader ? 'no-store' : 'max-age=60');
    return next.handle();
  }
}
