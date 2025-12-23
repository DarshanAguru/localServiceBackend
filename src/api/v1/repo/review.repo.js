import { db } from '../../../config/db.js';

export const insertReview = async (reviewData) => {
  const data = {
    comment: reviewData.comment,
    rating: reviewData.rating,
    consumer_id: reviewData.consumerId,
    service_id: reviewData.serviceId,
    provider_id: reviewData.providerId,
  };
  const cols = Object.keys(data);

  const provider_services_data =
    await db.sql`SELECT * FROM map_provider_services WHERE provider_id=${reviewData.providerId} AND service_id=${reviewData.serviceId}`;
  const provider_rating = Number(provider_services_data[0].avg_rating) || 0;
  const reviewsCount = Number(provider_services_data[0].review_count) || 1;
  let updated_rating;
  if (provider_rating === 0) {
    updated_rating = {
      avg_rating: reviewData.rating,
      review_count: reviewsCount,
    };
  } else {
    updated_rating = {
      avg_rating: (provider_rating + reviewData.rating) / 2,
      review_count: reviewsCount + 1,
    };
  }


  await db.sql`UPDATE map_provider_services SET ${db.sql(updated_rating, ['avg_rating', 'review_count'])} WHERE provider_id=${reviewData.providerId} AND service_id=${reviewData.serviceId}`;

  const res =
    await db.sql`INSERT INTO review ${db.sql(data, cols)} returning *`;
  return res[0];
};

export const findAllReviewsOfProvider = async (providerId) => {
  const res =
    await db.sql`SELECT * FROM review WHERE provider_id=${providerId}`;
  return res;
};

export const findAllReviewsOfConsumer = async (consumerId) => {
  const res =
    await db.sql`SELECT * FROM review WHERE consumer_id=${consumerId}`;
  return res;
};

export const findReviewByReviewId = async (id) => {
  const res = await db.sql`SELECT * FROM review WHERE id=${id}`;
  return res[0];
};

export const findReviewByIds = async (consumerId, providerId, serviceId) => {
  const res =
    await db.sql`SELECT * FROM review WHERE consumer_id=${consumerId} AND provider_id=${providerId} AND service_id=${serviceId}`;
  return res[0];
};

export const findAndDeleteReview = async (reviewId) => {
  const res = await db.sql`SELECT * FROM review WHERE id=${reviewId}`;
  const review = res[0];
  await db.sql`DELETE FROM review WHERE id=${reviewId}`;
  return review;
};
