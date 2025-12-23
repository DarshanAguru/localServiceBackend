import ErrorResponse from '../helpers/errorResponse.js';
import { logger } from '../helpers/logger.js';

// Global Error Handler
export const errorMiddleware = (err, req, res, next) => {
  try {
    const normalizedError = (() => {
      if (err instanceof ErrorResponse) return err;

      switch (err?.name) {
        case 'NO_DATA':
          return new ErrorResponse('No data from client', 400, 'NO_DATA');
        case 'INVALID_CREDENTIALS':
          return new ErrorResponse(
            'Invalid credentials',
            401,
            'INVALID_CREDENTIALS',
          );
        case 'VALIDATION_ERROR':
          return new ErrorResponse(
            err?.message || 'Validation Error',
            400,
            'VALIDATION_ERROR',
            err?.meta,
          );
        default:
          return new ErrorResponse(
            err?.message || 'Internal Server Error',
            err?.statusCode || 500,
            err?.name || 'ERROR',
          );
      }
    })();

    // Log Errors
    logger.error('Error from middleware', {
      name: normalizedError.name,
      statusCode: normalizedError.statusCode,
      message: normalizedError.message,
      path: req.originalUrl,
      method: req.method,
      meta: normalizedError.meta,
      stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack,
    });

    // Respond
    return res.status(normalizedError.statusCode).json({
      success: false,
      message: normalizedError.message || 'INTERNAL SERVER ERROR',
      error:
        process.env.NODE_ENV === 'production'
          ? undefined
          : { name: normalizedError.name, meta: normalizedError.meta },
    });
  } catch (e) {
    logger.error('Error in errorMiddleware', {
      message: e.message,
      stack: e.stack,
    });
    return next(e);
  }
};
