import { db } from '../../../config/db.js';

export const insertAppointment = async (appointmentData) => {
  const data = {
    description: appointmentData.description,
    preferred_date: appointmentData.preferredDate,
    service_id: appointmentData.serviceId,
    provider_id: appointmentData.providerId,
    consumer_id: appointmentData.consumerId,
    deadline: appointmentData.deadline,
    status: 'requested',
  };
  const cols = Object.keys(data);
  const res =
    await db.sql`INSERT INTO appointment ${db.sql(data, cols)} returning *`;
  return res[0];
};

export const findAllAppointmentsOfConsumer = async (consumerId) => {
  const res =
    await db.sql`SELECT * FROM appointment WHERE consumer_id=${consumerId}`;
  return res;
};

export const findAllAppointmentsOfProvider = async (providerId) => {
  const res =
    await db.sql`SELECT * FROM appointment WHERE provider_id=${providerId}`;
  return res;
};

export const findAppointmentOfConsumerWithService = async (consumerId, serviceId) => {
    const res =
    await db.sql`SELECT * FROM appointment WHERE consumer_id=${consumerId} AND service_id=${serviceId}`;
  return res;
}

export const updateStatusOfAppointment = async (status, appointmentId) => {
  const data = {
    status: status,
  };
  const res =
    await db.sql`UPDATE appointment SET ${db.sql(data, 'status')} WHERE id=${appointmentId} returning *`;
  return res[0];
};

export const updateDateOfAppointment = async (newDate, appointmentId) => {
  const data = {
    preferred_date: newDate,
  };
  const res =
    await db.sql`UPDATE appointment SET ${db.sql(data, 'preferred_date')} WHERE id=${appointmentId} returning *`;
  return res[0];
};

export const findAppointmentByAppointmentId = async (id) => {
  const res = await db.sql`SELECT * FROM appointment WHERE id=${id}`;
  return res[0];
};

export const findAppointmentByIds = async (
  consumerId,
  providerId,
  serviceId,
) => {
  const res =
    await db.sql`SELECT * FROM appointment WHERE consumer_id=${consumerId} AND provider_id=${providerId} AND service_id=${serviceId}`;
  return res[0];
};

export const findAndDeleteAppointment = async (appointmentId) => {
  const res = await db.sql`SELECT * FROM appointment WHERE id=${appointmentId}`;
  const appointment = res[0];
  await db.sql`DELETE FROM appointment WHERE id=${appointmentId}`;
  return appointment;
};
