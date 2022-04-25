import ServerError from './server.error';
import { HttpStatus } from '@nestjs/common';

export default class DateParseError extends ServerError {
  constructor(message = 'DATE_PARSE_ERROR') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
