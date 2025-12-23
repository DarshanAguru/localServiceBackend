import ErrorResponse from '../../../helpers/errorResponse.js';
import { addServicesToProviders } from '../repo/services.repo.js';
import {
  fetchAllProvidersOfService,
  fetchAllProvidersOfServiceFiltered,
} from '../services/providers.service.js';

export const addServices = async (req, res, next) => {
  try {
    const { serviceIds } = req.body;
    const count = await addServicesToProviders(req.user.id, serviceIds);
    return res
      .status(200)
      .json({
        status: true,
        message: 'Services added',
        data: { count: count },
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


export const getAllProvidersOfService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    if (!serviceId) {
      return next(
        new ErrorResponse(
          'Validation Error: serviceId not given in params',
          400,
          'VALIDATION_ERROR',
        ),
      );
    }

    const userId = req.user?.id;
    const byLocationThresRaw = req.query?.byLocationThres;

    // Normalize filters
    const byLocationThres =
      byLocationThresRaw && !Number.isNaN(Number(byLocationThresRaw))
        ? Math.min(30, Math.max(Number(byLocationThresRaw), 3)) // clamp 3..30 km
        : undefined;

    let allProviders = [];
    const hasFilter = (byLocationThres !== undefined);

    if (hasFilter && userId) {
      allProviders = await fetchAllProvidersOfServiceFiltered(serviceId, userId, {
        byLocationThres
      });
    } else {
      allProviders = await fetchAllProvidersOfService(serviceId);
    }

    return res.status(200).json({
      status: true,
      message: 'providers List fetched',
      data: allProviders,
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


export const getDetailsOfProvider = async (req, res, next) => {
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
    const provider = await getProvider(id);
    if (!provider) {
      return next(
        new ErrorResponse('There are no Providers yet!', 404, 'NOT_FOUND'),
      );
    }
    return res
      .status(200)
      .json({
        status: true,
        message: 'provider details fetched',
        data: { ...provider },
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
