import Joi from 'joi';

export const appointmentSchema = Joi.object({
  serviceId: Joi.string(),
  providerId: Joi.string(),
  description: Joi.string(),
  preferredDate: Joi.string(),
});
