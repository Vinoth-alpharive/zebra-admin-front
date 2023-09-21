class AppError extends Error {
  constructor(message, statusCode, fields = [], errorType = '') {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.fields = fields;
    this.errorType = errorType;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
