import ErrorResponse from '../../../helpers/errorResponse.js';
import { setVerificationStatus } from '../repo/services.repo.js';
import { fetchAllServices } from '../services/services.service.js';

export const getAllServices = async (req, res, next) => {
  try {
    const allServices = await fetchAllServices();
    if (!allServices) {
      return next(
        new ErrorResponse('There are no Services yet!', 404, 'NOT_FOUND'),
      );
    }
    return res
      .status(200)
      .json({ status: true, message: 'Services fetched', data: allServices });
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

export const verifyProviderService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { providerId } = req.body;
    if (!serviceId) {
      return next(
        new ErrorResponse(
          'Validation Error: serviceId is not given in params',
          400,
          'VALIDATION_ERROR',
        ),
      );
    }

    const verified = await setVerificationStatus(true, providerId, serviceId);
    return res.status(200).json({
      status: true,
      message: 'Verification status updated',
      data: { status: verified },
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
