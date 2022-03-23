import { ErrorResponse } from '../types/error-response.type';

export const isErrorResponse = (error: string | { message?: string; statusCode?: number }): error is ErrorResponse => {
  if (typeof error !== 'object') {
    return false;
  }

  if (typeof error.message !== 'string' && typeof error.statusCode !== 'number') {
    return false;
  }

  return true;
};
