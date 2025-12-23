import { findAllServices } from '../repo/services.repo.js';

export const fetchAllServices = async () => {
  try {
    const services = await findAllServices();
    return services;
  } catch (err) {
    console.log('Fetch All Services Error', err);
    return null;
  }
};
