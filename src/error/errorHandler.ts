import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AuthorizationError } from './authorization.error';
import NotFoundError from './not-found.error';
import CRUDError from './CRUD.error';

@Catch()
export class ErrorHandler implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(error: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const responseBody = this.getResponseBody(error);

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }

  getResponseBody(error: unknown): { statusCode: HttpStatus; message: string } {
    let message = 'INTERNAL_SERVER_ERROR';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (error instanceof AuthorizationError) {
      message = error.message;
      statusCode = HttpStatus.FORBIDDEN;
    } else if (error instanceof NotFoundError) {
      message = error.message;
      statusCode = HttpStatus.NOT_FOUND;
    } else if (error instanceof CRUDError) {
      message = error.message;
      statusCode = HttpStatus.BAD_REQUEST;
    } else if (error instanceof HttpException) {
      message = error.message;
      statusCode = error.getStatus();
    }

    return { statusCode, message };
  }
}
