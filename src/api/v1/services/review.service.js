import { findAppointmentByIds } from '../repo/appointment.repo.js';
import {
  findAllReviewsOfConsumer,
  findAllReviewsOfProvider,
  findAndDeleteReview,
  findReviewByIds,
  findReviewByReviewId,
  insertReview,
} from '../repo/review.repo.js';

export const addNewReview = async (data) => {
  try {
    const review = await findReviewByIds(
      data.consumerId,
      data.providerId,
      data.serviceId,
    );
    if (review) {
      console.info('Review already present');
      return {error: "Review Already Present", data: null};
    }
    const appointment = await findAppointmentByIds(
      data.consumerId,
      data.providerId,
      data.serviceId
    );
    if(!appointment)
    {
      console.log("No service booked with given provider, hence no review allowed.");
      return {error: "Review Not allowed", data: null};
    }

    if(Date.parse(appointment.deadline) > Date.now())
    {
        console.log("Wait till deadline.");
        return {error: "Wait Till Deadline", data: null};
    }
    const inserted = await insertReview(data);
    return {error: null, data:inserted};
  } catch (err) {
    console.log('New Review Error', err);
    return {error: "Error", data: null};
  }
};

export const fetchReview = async (id) => {
  try {
    const review = await findReviewByReviewId(id);
    if (!review) {
      console.info('No review Found');
      return null;
    }
    return review;
  } catch (err) {
    console.log('Fetch review error', err);
    return null;
  }
};

export const fetchReviewsOfConsumer = async (id) => {
  try {
    const reviewsOfConsumer = await findAllReviewsOfConsumer(id);
    if (!reviewsOfConsumer) {
      return null;
    }
    return reviewsOfConsumer;
  } catch (err) {
    console.log('Fetch Reviews of Consumer Error', err);
    return null;
  }
};

export const fetchReviewsOfProvider = async (id) => {
  try {
    const reviewsOfProvider = await findAllReviewsOfProvider(id);
    if (!reviewsOfProvider) {
      return null;
    }
    return reviewsOfProvider;
  } catch (err) {
    console.log('Fetch Reviews of Provider Error', err);
    return null;
  }
};

export const fetchAndDeleteReview = async (id) => {
  try {
    const review = await findAndDeleteReview(id);
    if (!review) {
      return null;
    }
    return review;
  } catch (err) {
    console.log('Fetch and Delete Review Error', err);
    return null;
  }
};
