export default class ForbiddenOperationError extends Error {
  constructor(message = 'FORBIDDEN_OPERATION') {
    super(message);
  }
}
