// WhatToDoAI/mobile/src/utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CACHE_CONFIG } from '../config';
import { logError } from './errorHandling';

/**
 * Saves data to AsyncStorage with optional expiration
 */
export const storeData = async <T>(
  key: string,
  value: T,
  expiresInMs?: number
): Promise<void> => {
  try {
    const item = {
      value,
      timestamp: Date.now(),
      expiry: expiresInMs ? Date.now() + expiresInMs : null,
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    logError(error, { context: 'storeData', key });
    throw error;
  }
};

/**
 * Retrieves data from AsyncStorage, respecting expiration if set
 */
export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    
    if (!jsonValue) return null;
    
    const item = JSON.parse(jsonValue);
    
    // Check if data has expired
    if (item.expiry && Date.now() > item.expiry) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    
    return item.value as T;
  } catch (error) {
    logError(error, { context: 'getData', key });
    return null;
  }
};

/**
 * Removes data from AsyncStorage
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    logError(error, { context: 'removeData', key });
    throw error;
  }
};

/**
 * Clears all data from AsyncStorage
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    logError(error, { context: 'clearAllData' });
    throw error;
  }
};

/**
 * Clears expired data from AsyncStorage
 */
export const clearExpiredData = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    
    for (const key of keys) {
      const jsonValue = await AsyncStorage.getItem(key);
      
      if (jsonValue) {
        const item = JSON.parse(jsonValue);
        
        if (item.expiry && Date.now() > item.expiry) {
          await AsyncStorage.removeItem(key);
        }
      }
    }
  } catch (error) {
    logError(error, { context: 'clearExpiredData' });
    throw error;
  }
};

/**
 * Stores activity search results in cache
 */
export const cacheSearchResults = async (
  searchParams: any,
  results: any[]
): Promise<void> => {
  try {
    // Create a cache key based on search parameters
    const cacheKey = `search_${JSON.stringify(searchParams)}`;
    
    // Store results with expiration
    await storeData(cacheKey, results, CACHE_CONFIG.ACTIVITIES_TTL);
  } catch (error) {
    logError(error, { context: 'cacheSearchResults' });
    // Don't throw - caching failures shouldn't break the app
  }
};

/**
 * Retrieves cached activity search results
 */
export const getCachedSearchResults = async (
  searchParams: any
): Promise<any[] | null> => {
  try {
    // Create a cache key based on search parameters
    const cacheKey = `search_${JSON.stringify(searchParams)}`;
    
    // Get cached results
    return await getData<any[]>(cacheKey);
  } catch (error) {
    logError(error, { context: 'getCachedSearchResults' });
    return null;
  }
};

/**
 * Manages search history
 */
export const addToSearchHistory = async (query: string): Promise<void> => {
  try {
    // Get existing search history
    const history = await getData<string[]>('search_history') || [];
    
    // Remove duplicate if exists
    const filteredHistory = history.filter(item => item !== query);
    
    // Add new query to the beginning
    const newHistory = [query, ...filteredHistory].slice(0, CACHE_CONFIG.MAX_SEARCH_HISTORY);
    
    // Save updated history
    await storeData('search_history', newHistory);
  } catch (error) {
    logError(error, { context: 'addToSearchHistory' });
    // Don't throw - search history failures shouldn't break the app
  }
};

/**
 * Retrieves search history
 */
export const getSearchHistory = async (): Promise<string[]> => {
  try {
    return await getData<string[]>('search_history') || [];
  } catch (error) {
    logError(error, { context: 'getSearchHistory' });
    return [];
  }
};

/**
 * Clears search history
 */
export const clearSearchHistory = async (): Promise<void> => {
  try {
    await removeData('search_history');
  } catch (error) {
    logError(error, { context: 'clearSearchHistory' });
    throw error;
  }
};

export default {
  storeData,
  getData,
  removeData,
  clearAllData,
  clearExpiredData,
  cacheSearchResults,
  getCachedSearchResults,
  addToSearchHistory,
  getSearchHistory,
  clearSearchHistory,
};
