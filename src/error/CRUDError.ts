export default class CRUDError extends Error {
  constructor(message = 'Cannot create entity') {
    super(message);
  }
}
