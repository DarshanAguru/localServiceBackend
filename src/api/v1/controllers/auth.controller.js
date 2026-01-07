import ErrorResponse from '../../../helpers/errorResponse.js';
import { verify } from 'argon2';
import { env } from '../../../config/env.js';
import {
  addUser,
  fetchUserDetailsById,
  fetchUserById,
  fetchUserByUsername,
  insertTokens,
  fetchAllProviders,
  fetchAllConsumers,
} from '../services/auth.service.js';
import { formatRemainingTime } from '../../../helpers/formatTime.js';
import { signToken, verifyToken } from '../../../helpers/jwtHelpers.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await fetchUserByUsername(username);
    if (!user) {
      return next(
        new ErrorResponse('Invalid credentials', 401, 'INVALID_CREDENTIALS'),
      );
    }

    const validPass = await verify(user.password, password);
    if (!validPass) {
      return next(
        new ErrorResponse('Invalid credentials', 401, 'INVALID_CREDENTIALS'),
      );
    }

    const access = signToken(
      { sub: user.id, role: user.role },
      env.jwtAccessToken,
      env.jwtAccessTTL,
    );
    const refresh = signToken(
      { sub: user.id, role: user.role },
      env.jwtRefreshToken,
      env.jwtRefreshTTL,
    );

    await insertTokens(access, refresh, user.id);

    return res.status(200).json({
      success: true,
      message: 'Logged In',
      data: { id: user.id, role: user.role, access, refresh },
    });
  } catch (err) {
    return next(
      new ErrorResponse(
        err?.message || 'Internal Server Error',
        500,
        'INTERNAL_ERROR',
      ),
    );
  }
};

export const getUserDetailsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(
        new ErrorResponse(
          'Validation Error: id not given in params',
          400,
          'VALIDATION_ERROR',
        ),
      );
    }
    const userDetails = await fetchUserDetailsById(id);
    if (!userDetails) {
      return next(
        new ErrorResponse('No User Details found!', 404, 'NOT_FOUND'),
      );
    }
    return res.status(200).json({
      status: true,
      message: 'user details fetched',
      data: userDetails,
    });
  } catch (err) {
    return next(
      new ErrorResponse(
        err?.message || 'Internal Server Error',
        500,
        'INTERNAL_ERROR',
      ),
    );
  }
};

export const getAllProviders = async (req, res, next) => {
  try {
    const allProviders = await fetchAllProviders();
    return res
      .status(200)
      .json({ status: true, message: 'Providers fetched', data: allProviders });
  } catch (err) {
    return next(
      new ErrorResponse(
        err?.message || 'Internal Server Error',
        500,
        'INTERNAL_ERROR',
      ),
    );
  }
};

export const getAllConsumers = async (req, res, next) => {
  try {
    const allConsumers = await fetchAllConsumers();
    return res
      .status(200)
      .json({ status: true, message: 'Consumers fetched', data: allConsumers });
  } catch (err) {
    return next(
      new ErrorResponse(
        err?.message || 'Internal Server Error',
        500,
        'INTERNAL_ERROR',
      ),
    );
  }
};

export const register = async (req, res, next) => {
  try {
    const user = await addUser(req.body);
    if (user.error) {
      return res.status(209).json({
        status: false,
        message: user.error,
        data: null,
      });
    }
    return res.status(201).json({
      success: true,
      message: 'Registered successfully',
      data: { ...user.data },
    });
  } catch (err) {
    return next(
      new ErrorResponse(
        err?.message || 'Internal Server Error',
        500,
        'INTERNAL_ERROR',
      ),
    );
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refresh } = req.body;

    if (!refresh) {
      return next(new ErrorResponse('Invalid Token', 401, 'INVALID_TOKEN'));
    }

    let refreshPayload;
    try {
      refreshPayload = verifyToken(refresh, env.jwtRefreshToken);
    } catch (err) {
      console.log(err);
      return next(
        new ErrorResponse(
          'Invalid or expired refresh token',
          401,
          'INVALID_REFRESH_TOKEN',
        ),
      );
    }

    if (
      req.user?.id &&
      refreshPayload?.sub &&
      req.user.id !== refreshPayload.sub
    ) {
      return next(
        new ErrorResponse('Token subject mismatch', 401, 'SUBJECT_MISMATCH'),
      );
    }

    const user = await fetchUserById(refreshPayload.sub);
    if (!user) {
      return next(new ErrorResponse('Invalid user', 401, 'INVALID_USER'));
    }

    if (user.refresh_token !== refresh) {
      return next(
        new ErrorResponse('INVALID REFRESH TOKEN', 401, 'INVALID_TOKEN'),
      );
    }

    const newAccess = signToken(
      { sub: refreshPayload.sub, role: user.role },
      env.jwtAccessToken,
      env.jwtAccessTTL,
    );

    const ONE_DAY_SECONDS = 24 * 60 * 60;
    const now = Math.floor(Date.now() / 1000);
    const refreshExp = Number(refreshPayload?.exp || 0);
    const secondsRemaining = refreshExp - now;
    const shouldRotate = secondsRemaining <= ONE_DAY_SECONDS;

    const newRefresh = shouldRotate
      ? signToken(
          { sub: refreshPayload.sub, role: user.role },
          env.jwtRefreshToken,
          env.jwtRefreshTTL,
        )
      : refresh;

    await insertTokens(newAccess, newRefresh, user.id);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed',
      data: {
        username: refreshPayload.sub,
        role: user.role,
        access: newAccess,
        refresh: newRefresh,
        refreshRotated: shouldRotate,
        expiresIn: {
          access: env.jwtAccessTTL,
          refresh: formatRemainingTime(secondsRemaining),
        },
      },
    });
  } catch (err) {
    return next(
      new ErrorResponse(
        err?.message || 'Internal Server Error',
        500,
        'INTERNAL_ERROR',
      ),
    );
  }
};

export const logout = async (req, res, next) => {
  try {
    // remove the jwt token from db and invalidate it.
    await insertTokens('', '', req.user.id);
    return res
      .status(200)
      .json({ status: true, message: 'logged out', data: null });
  } catch (err) {
    return next(
      new ErrorResponse(
        err?.message || 'Internal Server Error',
        500,
        'INTERNAL_ERROR',
      ),
    );
  }
};
