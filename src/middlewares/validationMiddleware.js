import ErrorResponse from '../helpers/errorResponse.js';

export const validationMiddleware = (schema) => {
  return async (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorDetails = error.details.map((d) => d.message);
      return next(
        new ErrorResponse('VALIDATION ERROR', 400, 'VALIDATION_ERROR', {
          ...errorDetails,
        }),
      );
    }
    req.body = value;
    next();
  };
};
