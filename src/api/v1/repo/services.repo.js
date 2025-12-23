import { db } from '../../../config/db.js';

export const findAllServices = async () => {
  const res = await db.sql`SELECT * FROM services`;
  return res;
};

export const findServiceByName = async (serviceName) => {
  const res = await db.sql`SELECT * FROM services WHERE name=${serviceName}`;
  return res;
};

export const findAllServicesOfProvider = async (providerId) => {
  const res =
    await db.sql`SELECT * FROM map_provider_services WHERE provider_id=${providerId}`;
  return res;
};

export const findAllProvidersOfServices = async (serviceId) => {
  const res =
    await db.sql`
    SELECT
    mps.service_id,
    mps.provider_id,
    mps.avg_rating,
    mps.review_count,
    p.name as provider_name,
    p.location as provider_location,
    s.name as service_name
    FROM map_provider_services mps
    JOIN
    services s ON s.id = mps.service_id
    JOIN
    user_profile p ON p.user_id = mps.provider_id
    WHERE mps.service_id=${serviceId} AND mps.verified=${true}
    ORDER BY mps.avg_rating DESC`;
  return res;
};

export const addServicesToProviders = async (providerId, serviceIds) => {
  let res = [];
  const cols = ['provider_id', 'service_id'];
  for (let serviceId of serviceIds) {
    let data = {
      provider_id: providerId,
      service_id: serviceId,
      avg_rating: 0,
    };
    let updated =
      await db.sql`INSERT INTO map_provider_services ${db.sql(data, cols)} returning *`;
    res.push(updated);
  }
  return res.length;
};

export const setVerificationStatus = async (status, providerId, serviceId) => {
  const data = {
    verified: status,
  };
  const res =
    await db.sql`UPDATE map_provider_services SET ${db.sql(data, 'verified')} WHERE provider_id=${providerId} AND service_id=${serviceId} returning *`;
  return res[0];
};
