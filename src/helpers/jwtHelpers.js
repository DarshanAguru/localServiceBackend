import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from 'process';

export const signToken = (payload, secret, ttl) => {
  return jwt.sign(
    {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID(),
    },
    secret,
    {
      expiresIn: ttl,
      algorithm: 'HS256',
      issuer: env.jwtIssuer || 'auth-service',
      audience: env.jwtAudience || 'web-client',
    },
  );
};

// verify JWT
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret, {
    algorithms: ['HS256'],
    issuer: env.jwtIssuer || 'auth-service',
    audience: env.jwtAudience || 'web-client',
  });
};
