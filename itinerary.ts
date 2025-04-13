/**
 * Itinerary service
 */

import { 
  Itinerary, 
  ItineraryFilter, 
  ItineraryItem, 
  ItineraryPreferences,
  ItineraryShareOptions,
  ItineraryExportFormat,
  ItineraryStats,
  SavedItineraryList
} from '../types/itinerary';
import { get, post, put, del } from './api';

// API endpoints
const ITINERARY_ENDPOINTS = {
  ITINERARIES: '/itineraries',
  ITINERARY: (id: string) => `/itineraries/${id}`,
  ITINERARY_ITEMS: (id: string) => `/itineraries/${id}/items`,
  ITINERARY_ITEM: (itineraryId: string, itemId: string) => `/itineraries/${itineraryId}/items/${itemId}`,
  GENERATE: '/itineraries/generate',
  SHARE: (id: string) => `/itineraries/${id}/share`,
  EXPORT: (id: string, format: string) => `/itineraries/${id}/export/${format}`,
  STATS: (id: string) => `/itineraries/${id}/stats`,
  DUPLICATE: (id: string) => `/itineraries/${id}/duplicate`,
};

/**
 * Get all user itineraries with pagination and filtering
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param filter - Itinerary filter parameters
 * @returns Promise with itineraries list response
 */
export const getItineraries = async (
  page: number = 1,
  limit: number = 10,
  filter?: ItineraryFilter
): Promise<SavedItineraryList> => {
  return get<SavedItineraryList>(ITINERARY_ENDPOINTS.ITINERARIES, {
    page,
    limit,
    ...filter,
  });
};

/**
 * Get a single itinerary by ID
 * @param id - Itinerary ID
 * @returns Promise with itinerary data
 */
export const getItinerary = async (id: string): Promise<Itinerary> => {
  return get<Itinerary>(ITINERARY_ENDPOINTS.ITINERARY(id));
};

/**
 * Create a new itinerary
 * @param itinerary - Itinerary data
 * @returns Promise with created itinerary
 */
export const createItinerary = async (itinerary: Partial<Itinerary>): Promise<Itinerary> => {
  return post<Itinerary>(ITINERARY_ENDPOINTS.ITINERARIES, itinerary);
};

/**
 * Update an existing itinerary
 * @param id - Itinerary ID
 * @param itinerary - Updated itinerary data
 * @returns Promise with updated itinerary
 */
export const updateItinerary = async (
  id: string,
  itinerary: Partial<Itinerary>
): Promise<Itinerary> => {
  return put<Itinerary>(ITINERARY_ENDPOINTS.ITINERARY(id), itinerary);
};

/**
 * Delete an itinerary
 * @param id - Itinerary ID
 * @returns Promise<void>
 */
export const deleteItinerary = async (id: string): Promise<void> => {
  await del(ITINERARY_ENDPOINTS.ITINERARY(id));
};

/**
 * Add an item to an itinerary
 * @param itineraryId - Itinerary ID
 * @param item - Itinerary item data
 * @returns Promise with created item
 */
export const addItineraryItem = async (
  itineraryId: string,
  item: Partial<ItineraryItem>
): Promise<ItineraryItem> => {
  return post<ItineraryItem>(ITINERARY_ENDPOINTS.ITINERARY_ITEMS(itineraryId), item);
};

/**
 * Update an itinerary item
 * @param itineraryId - Itinerary ID
 * @param itemId - Item ID
 * @param item - Updated item data
 * @returns Promise with updated item
 */
export const updateItineraryItem = async (
  itineraryId: string,
  itemId: string,
  item: Partial<ItineraryItem>
): Promise<ItineraryItem> => {
  return put<ItineraryItem>(ITINERARY_ENDPOINTS.ITINERARY_ITEM(itineraryId, itemId), item);
};

/**
 * Remove an item from an itinerary
 * @param itineraryId - Itinerary ID
 * @param itemId - Item ID
 * @returns Promise<void>
 */
export const removeItineraryItem = async (itineraryId: string, itemId: string): Promise<void> => {
  await del(ITINERARY_ENDPOINTS.ITINERARY_ITEM(itineraryId, itemId));
};

/**
 * Generate an itinerary based on preferences
 * @param preferences - Itinerary generation preferences
 * @returns Promise with generated itinerary
 */
export const generateItinerary = async (
  preferences: ItineraryPreferences
): Promise<Itinerary> => {
  return post<Itinerary>(ITINERARY_ENDPOINTS.GENERATE, preferences);
};

/**
 * Share an itinerary
 * @param id - Itinerary ID
 * @param options - Share options
 * @returns Promise with share URL
 */
export const shareItinerary = async (
  id: string,
  options: ItineraryShareOptions
): Promise<{ shareUrl: string }> => {
  return post<{ shareUrl: string }>(ITINERARY_ENDPOINTS.SHARE(id), options);
};

/**
 * Export an itinerary
 * @param id - Itinerary ID
 * @param format - Export format
 * @returns Promise with export URL or blob
 */
export const exportItinerary = async (
  id: string,
  format: ItineraryExportFormat
): Promise<Blob | { exportUrl: string }> => {
  const response = await get<Blob | { exportUrl: string }>(
    ITINERARY_ENDPOINTS.EXPORT(id, format),
    {},
    { responseType: 'blob' }
  );
  return response;
};

/**
 * Get itinerary statistics
 * @param id - Itinerary ID
 * @returns Promise with itinerary stats
 */
export const getItineraryStats = async (id: string): Promise<ItineraryStats> => {
  return get<ItineraryStats>(ITINERARY_ENDPOINTS.STATS(id));
};

/**
 * Duplicate an existing itinerary
 * @param id - Itinerary ID to duplicate
 * @param newTitle - Optional new title for the duplicate
 * @returns Promise with the new itinerary
 */
export const duplicateItinerary = async (
  id: string,
  newTitle?: string
): Promise<Itinerary> => {
  return post<Itinerary>(ITINERARY_ENDPOINTS.DUPLICATE(id), { newTitle });
};

/**
 * Reorder itinerary items
 * @param itineraryId - Itinerary ID
 * @param itemIds - Array of item IDs in the new order
 * @returns Promise with updated itinerary
 */
export const reorderItineraryItems = async (
  itineraryId: string,
  itemIds: string[]
): Promise<Itinerary> => {
  return put<Itinerary>(ITINERARY_ENDPOINTS.ITINERARY_ITEMS(itineraryId), { itemIds });
};

export default {
  getItineraries,
  getItinerary,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  addItineraryItem,
  updateItineraryItem,
  removeItineraryItem,
  generateItinerary,
  shareItinerary,
  exportItinerary,
  getItineraryStats,
  duplicateItinerary,
  reorderItineraryItems,
};