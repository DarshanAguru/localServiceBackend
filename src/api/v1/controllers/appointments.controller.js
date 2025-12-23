import ErrorResponse from '../../../helpers/errorResponse.js';
import {
  addNewAppointment,
  fetchAndDeleteAppointment,
  fetchAndUpdateAppointment,
  fetchAppointment,
  fetchAppointmentsOfConsumer,
  fetchAppointmentsOfProvider,
} from '../services/appointment.service.js';

export const addAppointment = async (req, res, next) => {
  try {
    const appointment = await addNewAppointment({ ...req.body, consumerId: req.user.id});
    if (appointment.error) {
      return res
        .status(209)
        .json({
          status: false,
          message: appointment.error,
          data: null,
        });
    }
    return res
      .status(201)
      .json({
        status: true,
        message: 'Appointment Scheduled',
        data: { ...appointment.data },
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

export const getAppointmentsOfProvider = async (req, res, next) => {
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
    const appointmentsList = await fetchAppointmentsOfProvider(id);
    if (!appointmentsList) {
      return next(
        new ErrorResponse('No Appointments found!', 404, 'NOT_FOUND'),
      );
    }

    return res
      .status(200)
      .json({
        status: true,
        message: 'Appointment List fetched',
        data: appointmentsList,
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

export const getAppointmentsOfConsumer = async (req, res, next) => {
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
    const appointmentsList = await fetchAppointmentsOfConsumer(id);
    if (!appointmentsList) {
      return next(
        new ErrorResponse('No Appointments found!', 404, 'NOT_FOUND'),
      );
    }

    return res
      .status(200)
      .json({
        status: true,
        message: 'Appointments List fetched',
        data: appointmentsList,
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

export const getAppointmentData = async (req, res, next) => {
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
    const appointment = await fetchAppointment(id);
    if (!appointment) {
      return next(
        new ErrorResponse('No appointments found!', 404, 'NOT_FOUND'),
      );
    }
    return res
      .status(200)
      .json({
        status: true,
        message: 'Appointment data fetched',
        data: { ...appointment },
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

export const updateAppointmentStatus = async (req, res, next) => {
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
    const { status } = req.body;
    if (!status) {
      return next(
        new ErrorResponse(
          `Validation Error: 'date' not given in body`,
          400,
          'VALIDATION_ERROR',
        ),
      );
    }
    const updatedAppointment = await fetchAndUpdateAppointment(id, {
      status: status,
    });
    if (!updatedAppointment) {
      return next(
        new ErrorResponse('No Appointments found!', 404, 'NOT_FOUND'),
      );
    }
    return res
      .status(200)
      .json({
        status: true,
        message: 'Appointment updated successful',
        data: { ...updatedAppointment },
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

export const updateAppointmentDate = async (req, res, next) => {
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
    const { date } = req.body;
    if (!date) {
      return next(
        new ErrorResponse(
          `Validation Error: 'date' not given in body`,
          400,
          'VALIDATION_ERROR',
        ),
      );
    }
    const updatedAppointment = await fetchAndUpdateAppointment(id, {
      date: date,
    });
    if (!updatedAppointment) {
      return next(
        new ErrorResponse('No Appointments found!', 404, 'NOT_FOUND'),
      );
    }
    return res
      .status(200)
      .json({
        status: true,
        message: 'Appointment updated',
        data: { ...updatedAppointment },
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

export const deleteAppointment = async (req, res, next) => {
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
    const deleted = await fetchAndDeleteAppointment(id);
    if (!deleted) {
      return next(
        new ErrorResponse('No Appointments found!', 404, 'NOT_FOUND'),
      );
    }
    return res
      .status(200)
      .json({
        status: true,
        message: 'Appointment Deleted',
        data: { ...deleted },
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
