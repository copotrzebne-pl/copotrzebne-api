import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import ServerError from './server.error';

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
    if (error instanceof ServerError || error instanceof HttpException) {
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
