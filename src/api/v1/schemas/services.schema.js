import Joi from 'joi';

export const addServiceSchema = Joi.object({
  providerId: Joi.string().required(),
  serviceIds: Joi.array().required(),
});

export const verifyProviderServiceSchema = Joi.object({
  providerId: Joi.string().required(),
});
