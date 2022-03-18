import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IncomingMessage, ServerResponse } from 'http';

@Injectable()
export class AddCacheHeaderToResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response: ServerResponse = context.switchToHttp().getResponse();
    const request: IncomingMessage = context.switchToHttp().getRequest();
    const authHeader = request?.headers?.authorization || '';
    const hasAuthHeader = authHeader && authHeader.length > 0 && authHeader.indexOf('Bearer ') > -1;

    response.setHeader('Cache-Control', hasAuthHeader ? 'no-cache' : 'max-age=60');
    return next.handle();
  }
}
