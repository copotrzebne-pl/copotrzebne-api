import { IncomingMessage } from 'http';

export const getAuthHeaderFromContextRequest = (request: IncomingMessage): string | null => {
  const authHeader = request?.headers?.authorization || null;
  const hasAuthHeader = authHeader && authHeader.length > 0 && authHeader.indexOf('Bearer ') > -1;

  return hasAuthHeader ? authHeader : null;
};
