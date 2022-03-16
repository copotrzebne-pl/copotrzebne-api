export class AuthorizationError extends Error {
  constructor(message = 'METHOD_FORBIDDEN') {
    super(message);
  }
}
