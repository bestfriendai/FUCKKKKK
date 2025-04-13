/**
 * Storage utility for persisting data in the browser
 */

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  FAVORITES: 'favorites',
  RECENT_SEARCHES: 'recent_searches',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE_PREFERENCE: 'language_preference',
  ITINERARIES: 'itineraries',
  ONBOARDING_COMPLETED: 'onboarding_completed',
};

/**
 * Stores a value in localStorage
 * @param key - Storage key
 * @param value - Value to store
 */
export const storeData = <T>(key: string, value: T): void => {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
};

/**
 * Retrieves a value from localStorage
 * @param key - Storage key
 * @returns The stored value or null if not found
 */
export const getData = <T>(key: string): T | null => {
  try {
    const jsonValue = localStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

/**
 * Removes a value from localStorage
 * @param key - Storage key
 */
export const removeData = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

/**
 * Clears all data from localStorage
 */
export const clearAllData = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

/**
 * Gets all keys from localStorage
 * @returns Array of storage keys
 */
export const getAllKeys = (): string[] => {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.error('Error getting all keys:', error);
    throw error;
  }
};

/**
 * Stores a value in sessionStorage (cleared when browser is closed)
 * @param key - Storage key
 * @param value - Value to store
 */
export const storeSessionData = <T>(key: string, value: T): void => {
  try {
    const jsonValue = JSON.stringify(value);
    sessionStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing session data:', error);
    throw error;
  }
};

/**
 * Retrieves a value from sessionStorage
 * @param key - Storage key
 * @returns The stored value or null if not found
 */
export const getSessionData = <T>(key: string): T | null => {
  try {
    const jsonValue = sessionStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving session data:', error);
    throw error;
  }
};

/**
 * Removes a value from sessionStorage
 * @param key - Storage key
 */
export const removeSessionData = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing session data:', error);
    throw error;
  }
};

/**
 * Clears all data from sessionStorage
 */
export const clearAllSessionData = (): void => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing session data:', error);
    throw error;
  }
};

export default {
  storeData,
  getData,
  removeData,
  clearAllData,
  getAllKeys,
  storeSessionData,
  getSessionData,
  removeSessionData,
  clearAllSessionData,
  STORAGE_KEYS,
};