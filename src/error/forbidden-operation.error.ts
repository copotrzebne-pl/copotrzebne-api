import ServerError from './server.error';
import { HttpStatus } from '@nestjs/common';

export default class ForbiddenOperationError extends ServerError {
  constructor(message = 'FORBIDDEN_OPERATION') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
