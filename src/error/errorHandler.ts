import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AuthorizationError } from './authorization.error';
import NotFoundError from './not-found.error';
import CRUDError from './CRUD.error';
import IncorrectValueError from './incorrectValue.error';

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
    if (error instanceof AuthorizationError) {
      return {
        message: error.message,
        statusCode: HttpStatus.FORBIDDEN,
      };
    }

    if (error instanceof NotFoundError) {
      return {
        message: error.message,
        statusCode: HttpStatus.NOT_FOUND,
      };
    }

    if (error instanceof CRUDError || error instanceof IncorrectValueError) {
      return {
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    if (error instanceof HttpException) {
      return {
        message: error.message,
        statusCode: error.getStatus(),
      };
    }

    return {
      message: 'INTERNAL_SERVER_ERROR',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
}
