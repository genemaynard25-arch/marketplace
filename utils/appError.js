
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // sets this.message via Error

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // only operational errors are sent to client

    // Capture stack trace, excluding this constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
