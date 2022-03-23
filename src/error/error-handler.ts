import { HttpAdapterHost } from '@nestjs/core';
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

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
    // forward class validation errors
    if (error instanceof BadRequestException) {
      const errorResponse = error.getResponse();

      if (
        typeof errorResponse === 'object' &&
        errorResponse.hasOwnProperty('message') &&
        errorResponse.hasOwnProperty('statusCode')
      ) {
        return {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          message: errorResponse?.message || 'VALIDATION_ERROR',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          statusCode: errorResponse?.statusCode || HttpStatus.BAD_REQUEST,
        };
      }

      // in case of unexpected error structure
      return {
        message: 'VALIDATION_ERROR',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

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
