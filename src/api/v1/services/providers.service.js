import {
  findAllProvidersOfServices,
  findAllProvidersWithRatingsAndService,
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
  if ([lat1, lon1, lat2, lon2].some((v) => Number.isNaN(v))) return Infinity;
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

const getRating = (p) => {
  const r = Number(p.avg_rating);
  return Number.isFinite(r) ? r : 0;
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
          if (Number.isFinite(dist) && dist <= thres) {
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

export const fetchTopProvidersOfArea = async (consumerId) => {
  const providers = await findAllProvidersWithRatingsAndService();
  if (!consumerId) {
    return providers
      .slice()
      .sort((a, b) => getRating(b) - getRating(a))
      .slice(0, 3);
  }
  const consumer = await findUserDetailsById(consumerId);
  if (!consumer) {
    return providers
      .slice()
      .sort((a, b) => getRating(b) - getRating(a))
      .slice(0, 3);
  }
  const cLoc = toNumLatLong(consumer.location);
  const enhancedProvidersData = providers
    .map((p) => {
      const pLoc = toNumLatLong(p.provider_location);
      if (!pLoc || !Number.isFinite(pLoc.lat) || !Number.isFinite(pLoc.long)) {
        return null;
      }
      const dist = haversineKm(cLoc.lat, cLoc.long, pLoc.lat, pLoc.long);
      if (!Number.isFinite(dist)) {
        return null;
      }
      return {
        ...p,
        distance: dist,
        ratingNum: getRating(p),
      };
    })
    .filter((v) => v !== null);

  enhancedProvidersData.sort((a, b) => {
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    return a.ratingNum - b.ratingNum;
  });

  const topProviders = enhancedProvidersData.map((p) => {
    return {
      ...p,
      distance: `${p.distance.toFixed(2)} Km`,
      ratingNum: undefined,
    };
  });
  return topProviders.slice(0, 3);
};

export const fetchAllProvidersOfService = async (serviceId, consumerId) => {
  try {
    const providers = await findAllProvidersOfServices(serviceId);
    if (!consumerId) {
      return providers;
    }
    const consumer = await findUserDetailsById(consumerId);
    if (!consumer) {
      return providers;
    }
    const cLoc = toNumLatLong(consumer.location);
    const updatedProvidersData = providers.reduce((acc, p) => {
      const pLoc = toNumLatLong(p.provider_location);
      const dist = haversineKm(cLoc.lat, cLoc.long, pLoc.lat, pLoc.long);
      if (Number.isFinite(dist)) {
        acc.push({
          ...p,
          distance: `${Number(dist.toFixed(2))} km`,
        });
      }
      return acc;
    }, []);

    return updatedProvidersData;
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
