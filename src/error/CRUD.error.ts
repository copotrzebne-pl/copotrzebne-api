export default class CRUDError extends Error {
  constructor(message = 'CANNOT_CREATE_ENTITY') {
    super(message);
  }
}
