export default class NotFoundError extends Error {
  constructor(message = 'NOT_FOUND') {
    super(message);
  }
}
