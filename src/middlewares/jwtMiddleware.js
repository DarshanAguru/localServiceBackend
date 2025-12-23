import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import ErrorResponse from '../helpers/errorResponse.js';
import { findByUserIdFromAuth } from '../api/v1/repo/user.repo.js';

const extractToken = (req) => {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (authHeader && typeof authHeader === 'string') {
    const [scheme, token] = authHeader.split(' ');
    if (scheme?.toLowerCase() === 'bearer' && token) {
      return token.trim();
    }
  }
  return null;
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwtAccessToken, {
    algorithms: ['HS256'],
    issuer: env.jwtIssuer || 'auth-service',
    audience: env.jwtAudience || 'web-client',
    clockTolerance: 5,
  });
};

export const jwtAuthMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return next(
        new ErrorResponse('Missing access token', 401, 'TOKEN_MISSING'),
      );
    }

    const payload = verifyAccessToken(token);

    req.auth = payload;
    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    const user = await findByUserIdFromAuth(payload.sub);
    if (!user) {
      return next(new ErrorResponse('User Not Found', 404, 'NOT_FOUND'));
    }
    if (user.access_token !== token) {
      return next(new ErrorResponse('Invalid Token', 401, 'TOKEN_INVALID'));
    }

    return next();
  } catch (err) {
    const code = err?.name === 'TokenExpiredError' ? 401 : 401;
    const type =
      err?.name === 'TokenExpiredError'
        ? 'TOKEN_EXPIRED'
        : err?.name === 'NotBeforeError'
          ? 'TOKEN_NOT_ACTIVE'
          : 'TOKEN_INVALID';

    return next(new ErrorResponse(err?.message || 'Invalid token', code, type));
  }
};

export const optionalAuth = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    req.auth = null;
    req.user = null;
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    req.auth = payload;
    req.user = {
      id: payload.sub,
      role: payload.role,
    };
    const user = await findByUserIdFromAuth(payload.sub);
    if (!user) {
      return next(new ErrorResponse('User Not Found', 404, 'NOT_FOUND'));
    }
    if (user.access_token !== token) {
      return next(new ErrorResponse('Invalid Token', 401, 'TOKEN_INVALID'));
    }
    return next();
  } catch (err) {
    console.log('optionalAuth: access token invalid/expired', err?.message);
    req.auth = null;
    req.user = null;
    return next();
  }
};

export const requireAuth = async (req, res, next) => {
  if (!req.auth || !req.user?.id) {
    return next(
      new ErrorResponse('Authentication required', 401, 'AUTH_REQUIRED'),
    );
  }
  return next();
};

export const requireRole = (roles) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return async (req, res, next) => {
    if (!req.auth || !req.user?.role) {
      return next(
        new ErrorResponse('Authentication required', 401, 'AUTH_REQUIRED'),
      );
    }

    const hasRole = allowedRoles.includes(req.user.role);
    if (!hasRole) {
      return next(new ErrorResponse('Forbidden', 403, 'FORBIDDEN'));
    }

    return next();
  };
};
