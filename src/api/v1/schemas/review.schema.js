import Joi from 'joi';

export const reviewSchema = Joi.object({
  rating: Joi.number(),
  comment: Joi.string(),
  providerId: Joi.string(),
  serviceId: Joi.string(),
});
