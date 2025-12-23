import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(4).required(),
  address: Joi.string().optional(),
  location: Joi.object({
    latitude: Joi.string(),
    longitude: Joi.string(),
  }).optional(),
  age: Joi.number().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().required(),
  gender: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refresh: Joi.string().optional(),
});
