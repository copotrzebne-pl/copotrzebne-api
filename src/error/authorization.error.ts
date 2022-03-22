import ServerError from './server.error';
import { HttpStatus } from '@nestjs/common';

export class AuthorizationError extends ServerError {
  constructor(message = 'METHOD_FORBIDDEN') {
    super(message, HttpStatus.FORBIDDEN);
  }
}
