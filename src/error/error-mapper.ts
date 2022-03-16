import { HttpException, HttpStatus } from '@nestjs/common';

import NotFoundError from './not-found.error';
import CRUDError from './CRUDError';
import { AuthorizationError } from './authorization.error';

export const mapErrorToHttpException = (error: unknown): HttpException => {
  if (error instanceof AuthorizationError) {
    return new HttpException(error.message, HttpStatus.FORBIDDEN);
  }

  if (error instanceof NotFoundError) {
    return new HttpException(error.message, HttpStatus.NOT_FOUND);
  }

  if (error instanceof CRUDError) {
    return new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }

  return new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
};
