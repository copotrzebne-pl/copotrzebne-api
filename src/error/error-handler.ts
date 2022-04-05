import { HttpAdapterHost } from '@nestjs/core';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import ServerError from './server.error';
import { isErrorResponse } from './helpers/is-error-response.helper';

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

      if (isErrorResponse(errorResponse)) {
        return {
          message: errorResponse.message,
          statusCode: errorResponse.statusCode,
        };
      }

      return {
        message: 'VALIDATION_ERROR',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    if (error instanceof ServerError || error instanceof HttpException) {
      Logger.error(`An error occured and was handled gracefully: ${error}`);
      return {
        message: error.message,
        statusCode: error.getStatus(),
      };
    }

    Logger.error(`An unknown error has occurred: ${error}`);
    return {
      message: 'INTERNAL_SERVER_ERROR',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
}
