import { ErrorResponse } from '../types/error-response.type';

export const isErrorResponse = (error: string | { message?: string; statusCode?: number }): error is ErrorResponse => {
  if (typeof error !== 'object') {
    return false;
  }

  const hasMessage = typeof error.message === 'string' || Array.isArray(error.message);

  if (!hasMessage || typeof error.statusCode !== 'number') {
    return false;
  }

  return true;
};
