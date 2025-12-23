import {
  findAllProvidersOfServices,
  findAllServicesOfProvider,
} from '../repo/services.repo.js';
import {
  findByUserIdFromProfile,
  findUserDetailsById,
} from '../repo/user.repo.js';

// helpers
const toNumLatLong = (location) => {
  try {
    return {
      lat: Number(location?.latitude),
      long: Number(location?.longitude),
    };
  } catch {
    return { lat: NaN, long: NaN };
  }
};

const haversineKm = (lat1, lon1, lat2, lon2) => {
  if ([lat1, lon1, lat2, lon2].some(v => Number.isNaN(v))) return Infinity;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


// services
export const fetchAllProvidersOfServiceFiltered = async (
  serviceId,
  consumerId,
  filter,
) => {
  try {
    const consumer = await findUserDetailsById(consumerId);
    if (!consumer) {
      console.log('User not found');
      return null;
    }
    const cLoc = toNumLatLong(consumer.location);
    const providers = await findAllProvidersOfServices(serviceId);
    if (!providers || providers.length === 0) {
      console.log('No providers');
      return null;
    }

  const thres = filter.byLocationThres;
   const filtered = thres
      ? providers.reduce((acc, p) => {
          const pLoc = toNumLatLong(p.provider_location);
          const dist = haversineKm(cLoc.lat, cLoc.long, pLoc.lat, pLoc.long);
          if(Number.isFinite(dist) && dist <= thres)
          {
            acc.push({
              ...p,
              distance: `${Number(dist.toFixed(2))} km`,
            });
          }
          return acc;
        }, [])
      : providers;

      return filtered;
  } catch (err) {
    console.log('Fetch All provider of Service with Filter Error', err);
    return null;
  }
};

export const fetchAllProvidersOfService = async (serviceId) => {
  try {
    const providers = await findAllProvidersOfServices(serviceId);
    return providers;
  } catch (err) {
    console.log('Fetch All Provicers Error', err);
    return null;
  }
};

export const getProvider = async (id) => {
  try {
    const provider_details = await findByUserIdFromProfile(id);
    const servicesOfProvider = await findAllServicesOfProvider(id);
    return { provider_details, ...servicesOfProvider };
  } catch (err) {
    console.log('Get Provider Error', err);
    return null;
  }
};
