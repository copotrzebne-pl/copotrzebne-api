import ServerError from './server.error';
import { HttpStatus } from '@nestjs/common';

export default class CRUDError extends ServerError {
  constructor(message = 'CANNOT_CREATE_ENTITY') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
