import { HttpStatus } from '@nestjs/common';

export type ErrorResponse = {
  message: string;
  statusCode: HttpStatus;
};
