import ServerError from './server.error';
import { HttpStatus } from '@nestjs/common';

export default class IncorrectValueError extends ServerError {
  constructor(message = 'INCORRECT_VALUE') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
