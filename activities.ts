/**
 * Activities service
 */

import { 
  Activity, 
  ActivityFilter, 
  Category, 
  Location, 
  ActivityPageParams,
  ActivitySearchResponse,
  ActivityReview
} from '../types/activity';
import { get, post, del } from './api';

// API endpoints
const ACTIVITIES_ENDPOINTS = {
  ACTIVITIES: '/activities',
  ACTIVITY: (id: string) => `/activities/${id}`,
  CATEGORIES: '/categories',
  NEARBY: '/activities/nearby',
  SEARCH: '/activities/search',
  FAVORITES: '/activities/favorites',
  FAVORITE: (id: string) => `/activities/favorites/${id}`,
  RECOMMENDATIONS: '/activities/recommendations',
  POPULAR: '/activities/popular',
  REVIEWS: (id: string) => `/activities/${id}/reviews`,
  REVIEW: (activityId: string, reviewId: string) => `/activities/${activityId}/reviews/${reviewId}`,
};

/**
 * Get all activities with pagination and filtering
 * @param params - Pagination and filter parameters
 * @returns Promise with activities search response
 */
export const getActivities = async (
  params: ActivityPageParams & Partial<ActivityFilter>
): Promise<ActivitySearchResponse> => {
  return get<ActivitySearchResponse>(ACTIVITIES_ENDPOINTS.ACTIVITIES, params);
};

/**
 * Get a single activity by ID
 * @param id - Activity ID
 * @returns Promise with activity data
 */
export const getActivity = async (id: string): Promise<Activity> => {
  return get<Activity>(ACTIVITIES_ENDPOINTS.ACTIVITY(id));
};

/**
 * Get all activity categories
 * @returns Promise with categories array
 */
export const getCategories = async (): Promise<Category[]> => {
  return get<Category[]>(ACTIVITIES_ENDPOINTS.CATEGORIES);
};

/**
 * Get nearby activities based on location
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 * @param radius - Search radius in kilometers (default: 5)
 * @param params - Pagination and additional filter parameters
 * @returns Promise with nearby activities search response
 */
export const getNearbyActivities = async (
  latitude: number,
  longitude: number,
  radius: number = 5,
  params?: Omit<ActivityPageParams & Partial<ActivityFilter>, 'distance'>
): Promise<ActivitySearchResponse> => {
  return get<ActivitySearchResponse>(ACTIVITIES_ENDPOINTS.NEARBY, {
    latitude,
    longitude,
    radius,
    ...params,
  });
};

/**
 * Search activities by query
 * @param query - Search query
 * @param params - Pagination and additional filter parameters
 * @returns Promise with search results
 */
export const searchActivities = async (
  query: string,
  params?: Omit<ActivityPageParams & Partial<ActivityFilter>, 'searchQuery'>
): Promise<ActivitySearchResponse> => {
  return get<ActivitySearchResponse>(ACTIVITIES_ENDPOINTS.SEARCH, {
    query,
    ...params,
  });
};

/**
 * Get user's favorite activities
 * @param params - Pagination parameters
 * @returns Promise with favorite activities search response
 */
export const getFavorites = async (
  params?: ActivityPageParams
): Promise<ActivitySearchResponse> => {
  return get<ActivitySearchResponse>(ACTIVITIES_ENDPOINTS.FAVORITES, params);
};

/**
 * Add an activity to favorites
 * @param activityId - Activity ID
 * @returns Promise<void>
 */
export const addToFavorites = async (activityId: string): Promise<void> => {
  await post(ACTIVITIES_ENDPOINTS.FAVORITES, { activityId });
};

/**
 * Remove an activity from favorites
 * @param activityId - Activity ID
 * @returns Promise<void>
 */
export const removeFromFavorites = async (activityId: string): Promise<void> => {
  await del(ACTIVITIES_ENDPOINTS.FAVORITE(activityId));
};

/**
 * Get personalized activity recommendations
 * @param params - Pagination parameters
 * @returns Promise with recommended activities search response
 */
export const getRecommendations = async (
  params?: ActivityPageParams
): Promise<ActivitySearchResponse> => {
  return get<ActivitySearchResponse>(ACTIVITIES_ENDPOINTS.RECOMMENDATIONS, params);
};

/**
 * Get popular activities
 * @param location - Optional location to filter by
 * @param params - Pagination parameters
 * @returns Promise with popular activities search response
 */
export const getPopularActivities = async (
  location?: Partial<Location>,
  params?: ActivityPageParams
): Promise<ActivitySearchResponse> => {
  return get<ActivitySearchResponse>(ACTIVITIES_ENDPOINTS.POPULAR, { 
    location, 
    ...params 
  });
};

/**
 * Get reviews for an activity
 * @param activityId - Activity ID
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns Promise with reviews array
 */
export const getActivityReviews = async (
  activityId: string,
  page: number = 1,
  limit: number = 10
): Promise<ActivityReview[]> => {
  return get<ActivityReview[]>(ACTIVITIES_ENDPOINTS.REVIEWS(activityId), {
    page,
    limit,
  });
};

/**
 * Add a review for an activity
 * @param activityId - Activity ID
 * @param rating - Rating (1-5)
 * @param comment - Review comment
 * @returns Promise with created review
 */
export const addActivityReview = async (
  activityId: string,
  rating: number,
  comment: string
): Promise<ActivityReview> => {
  return post<ActivityReview>(ACTIVITIES_ENDPOINTS.REVIEWS(activityId), {
    rating,
    comment,
  });
};

/**
 * Delete a review
 * @param activityId - Activity ID
 * @param reviewId - Review ID
 * @returns Promise<void>
 */
export const deleteActivityReview = async (
  activityId: string,
  reviewId: string
): Promise<void> => {
  await del(ACTIVITIES_ENDPOINTS.REVIEW(activityId, reviewId));
};

export default {
  getActivities,
  getActivity,
  getCategories,
  getNearbyActivities,
  searchActivities,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getRecommendations,
  getPopularActivities,
  getActivityReviews,
  addActivityReview,
  deleteActivityReview,
};