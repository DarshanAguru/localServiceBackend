import { hash } from 'argon2';
import {
  findAllConsumers,
  findAllProviders,
  findByUserIdFromAuth,
  findByUsernameFromAuth,
  findUserDetailsById,
  insertIntoAuth,
  insertIntoUserProfile,
  updateTokensFromAuth,
} from '../repo/user.repo.js';

export const fetchUserDetailsById = async (id) => {
  try {
    const userDetails = await findUserDetailsById(id);
    return userDetails;
  } catch (err) {
    console.log('Find user details error', err);
    return null;
  }
};

export const fetchUserByUsername = async (username) => {
  try {
    const user = await findByUsernameFromAuth(username);
    return user;
  } catch (err) {
    console.log('Find by username error', err);
    return null;
  }
};

export const fetchUserById = async (id) => {
  try {
    const user = await findByUserIdFromAuth(id);
    return user;
  } catch (err) {
    console.log('Find by userId error', err);
  }
};

export const insertTokens = async (accessToken, refreshToken, userId) => {
  try {
    await updateTokensFromAuth(accessToken, refreshToken, userId);
    return true;
  } catch (err) {
    console.log('Refresh token Error', err);
    return false;
  }
};

export const addUser = async (data) => {
  try {
    const present = await findByUsernameFromAuth(data.email);
    if (present) {
      console.info('User already present');
      return { error: 'User Already Present', data: null };
    }
    const authData = {
      username: data.email,
      password: await hash(data.password),
      role: data.role,
    };
    const user = await insertIntoAuth(authData);
    const userDetails = {
      user_id: user.id,
      address: data.address,
      location: data.location,
      age: data.age,
      phone: data.phone,
      email: data.email,
      name: data.name,
      gender: data.gender,
    };
    await insertIntoUserProfile(userDetails);
    return {
      error: null,
      data: {
        ...user,
        access_token: undefined,
        refresh_token: undefined,
        password: undefined,
      },
    };
  } catch (err) {
    console.log('User Registration Error', err);
    return { error: 'Error', data: null };
  }
};

export const fetchAllProviders = async () => {
  try {
    const providers = await findAllProviders();
    return providers;
  } catch (err) {
    console.log('Fetch All Provicers Error', err);
    return null;
  }
};

export const fetchAllConsumers = async () => {
  try {
    const consumers = await findAllConsumers();
    return consumers;
  } catch (err) {
    console.log('Fetch All Consumers Error', err);
    return null;
  }
};
