export default class IncorrectValueError extends Error {
  constructor(message = 'INCORRECT_VALUE') {
    super(message);
  }
}
