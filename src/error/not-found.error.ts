import ServerError from './server.error';
import { HttpStatus } from '@nestjs/common';

export default class NotFoundError extends ServerError {
  constructor(message = 'NOT_FOUND') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
