import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT ?? 3001,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  jwtRefreshToken: process.env.JWT_REFRESH_TOKEN,
  jwtAccessToken: process.env.JWT_ACCESS_TOKEN,
  jwtAccessTTL: process.env.JWT_ACCESS_TTL ?? '15m',
  jwtRefreshTTL: process.env.JWT_REFRESH_TTL ?? '7d',
  jwtIssuer: process.env.JWT_ISSUER ?? 'auth-service',
  jwtAudience: process.env.JWT_AUDIENCE ?? 'web-client',
  dbURL: process.env.DB_URL_STRING,
};
