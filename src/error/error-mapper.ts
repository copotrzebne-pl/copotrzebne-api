import { HttpException, HttpStatus } from '@nestjs/common';

import NotFoundError from './not-found.error';
import CRUDError from './CRUDError';
import { AuthorizationError } from './authorization.error';

export const errorHandler = (error: unknown): void => {
  if (error instanceof AuthorizationError) {
    throw new HttpException(error.message, HttpStatus.FORBIDDEN);
  }

  if (error instanceof NotFoundError) {
    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  }

  if (error instanceof CRUDError) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }

  throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
};
