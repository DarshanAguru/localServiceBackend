import { db } from '../../../config/db.js';

export const findAllConsumersFromAuth = async () => {
  const res = await db.sql`SELECT * FROM auth WHERE role=${'CONSUMER'}`;
  return res;
};

export const findAllProvidersFromAuth = async () => {
  const res = await db.sql`SELECT * FROM auth WHERE role=${'PROVIDER'}`;
  return res;
};

export const findByUserIdFromAuth = async (id) => {
  const res = await db.sql`SELECT * FROM auth WHERE id=${id}`;
  return res[0];
};

export const findByUsernameFromAuth = async (username) => {
  const res = await db.sql`SELECT * FROM auth WHERE username=${username}`;
  return res[0];
};

export const findByNameFromProfile = async (name) => {
  const res = await db.sql`SELECT * FROM user_profile WHERE name=${name}`;
  return res[0];
};

export const findByUserIdFromProfile = async (id) => {
  const res = await db.sql`SELECT * FROM user_profile WHERE user_id=${id}`;
  return res[0];
};

export const insertIntoAuth = async (authData) => {
  const cols = Object.keys(authData);
  const res =
    await db.sql`INSERT INTO auth ${db.sql(authData, cols)} returning *`;
  return res[0];
};

export const insertIntoUserProfile = async (userData) => {
  const cols = Object.keys(userData);
  const res =
    await db.sql`INSERT INTO user_profile ${db.sql(userData, cols)} returning *`;
  return res[0];
};

export const updateTokensFromAuth = async (accessToken, refreshToken, id) => {
  const data = {
    refresh_token: refreshToken,
    access_token: accessToken,
  };
  const res =
    await db.sql`UPDATE auth SET ${db.sql(data, 'refresh_token', 'access_token')} WHERE id=${id} returning *`;
  return res[0];
};

export const updatePasswordForUserInAuth = async (password, id) => {
  const data = {
    password: password,
  };
  const res =
    await db.sql`UPDATE auth SET ${db.sql(data, 'password')} WHERE id=${id} returning *`;
  return res[0];
};

export const updateUserDetailsFromProfile = async (updatedData, id) => {
  const data = {
    ...updatedData,
  };
  const cols = Object.keys(updatedData);
  const res =
    await db.sql`UPDATE user_profile SET ${db.sql(data, cols)} WHERE user_id=${id} returning *`;
  return res[0];
};

export const findUserDetailsById = async (id) => {
  const res = await db.sql`SELECT * FROM user_profile WHERE user_id=${id}`;
  return res[0];
};

export const findAllProviders = async () => {
  const res = await db.sql`
SELECT
  usp.user_id   AS id,
  usp.name      AS name,
  usp.email     AS email,
  usp.phone     AS phone,
  usp.age       AS age,
  usp.location  AS location,
  usp.address   AS address
FROM auth a
JOIN user_profile usp ON a.id = usp.user_id
WHERE a.role = 'PROVIDER';
`;
  return res;
};

export const findAllConsumers = async () => {
  const res = await db.sql`
SELECT
  usp.user_id   AS id,
  usp.name      AS name,
  usp.email     AS email,
  usp.phone     AS phone,
  usp.age       AS age,
  usp.location  AS location,
  usp.address   AS address
FROM auth a
JOIN user_profile usp ON a.id = usp.user_id
WHERE a.role = 'CONSUMER';
`;
  return res;
};
