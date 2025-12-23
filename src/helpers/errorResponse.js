export default class ErrorResponse extends Error {
  constructor(message, statusCode = 500, name = 'ERROR', meta = {}) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.meta = meta;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
