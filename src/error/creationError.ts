export default class CreationError extends Error {
  constructor(message = 'Cannot create entity') {
    super(message);
  }
}
