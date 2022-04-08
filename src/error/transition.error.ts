import ServerError from './server.error';
import { HttpStatus } from '@nestjs/common';

export default class TransitionError extends ServerError {
  constructor(message = 'TRANSITION_ERROR') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
