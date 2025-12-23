import ErrorResponse from '../../../helpers/errorResponse.js';
import {
  addNewReview,
  fetchAndDeleteReview,
  fetchReview,
  fetchReviewsOfConsumer,
  fetchReviewsOfProvider,
} from '../services/review.service.js';

export const addReview = async (req, res, next) => {
  try {
    const review = await addNewReview({ consumerId: req.user.id , ...req.body});
    if (review.error) {
      return res
        .status(209)
        .json({
          status: false,
          message: review.error,
          data: null,
        });
    }
    return res
      .status(201)
      .json({ status: true, message: 'Review Added', data: { ...review.data } });
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

export const getReviewData = async (req, res, next) => {
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

    const reviewData = await fetchReview(id);
    if (!reviewData) {
      return next(new ErrorResponse('No Reviews found!', 404, 'NOT_FOUND'));
    }
    return res
      .status(200)
      .json({
        status: true,
        message: 'Review data fetched',
        data: { ...reviewData },
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

export const getReviewsOfConsumer = async (req, res, next) => {
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
    const reviewsList = await fetchReviewsOfConsumer(id);
    if (!reviewsList) {
      return next(new ErrorResponse('No Reviews found!', 404, 'NOT_FOUND'));
    }

    return res
      .status(200)
      .json({
        status: true,
        message: 'Review List fetched',
        data: reviewsList,
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

export const getReviewsOfProvider = async (req, res, next) => {
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
    const reviewsList = await fetchReviewsOfProvider(id);
    if (!reviewsList) {
      return next(new ErrorResponse('No Reviews found!', 404, 'NOT_FOUND'));
    }

    return res
      .status(200)
      .json({
        status: true,
        message: 'Review List fetched',
        data: reviewsList,
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

export const deleteReview = async (req, res, next) => {
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
    const deleted = await fetchAndDeleteReview(id);
    if (!deleted) {
      return next(new ErrorResponse('No Reviews found!', 404, 'NOT_FOUND'));
    }
    return res
      .status(200)
      .json({ status: true, message: 'Review deleted', data: { ...deleted } });
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
