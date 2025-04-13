// WhatToDoAI/mobile/src/config.ts
// Note: expo-constants is no longer needed for these specific variables
// API Configuration
export const API_CONFIG = {
  BASE_URL: `${process.env.EXPO_PUBLIC_SUPABASE_URL ?? ''}/functions/v1`, // Derived from Supabase URL
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// Authentication Configuration
export const AUTH_CONFIG = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://your-supabase-project.supabase.co', // Loaded from .env
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'your-supabase-anon-key', // Loaded from .env
  SESSION_STORAGE_KEY: 'whattodoai_session',
};

// API Keys (for compatibility with existing code)
export const API_KEYS = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://your-supabase-project.supabase.co', // Loaded from .env
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'your-supabase-anon-key', // Loaded from .env
  EVENTBRITE_TOKEN: process.env.EXPO_PUBLIC_EVENTBRITE_TOKEN ?? 'EUB5KUFLJH2SKVCHVD3E', // Eventbrite private token
  EVENTBRITE_PUBLIC_TOKEN: process.env.EXPO_PUBLIC_EVENTBRITE_PUBLIC_TOKEN ?? 'C4WQAR3XB7XX2AYOUEQ4', // Eventbrite public token
  RAPIDAPI_KEY: process.env.EXPO_PUBLIC_RAPIDAPI_KEY ?? '33351bd536msha426eb3e02f04cdp1c6c75jsnb775e95605b8', // RapidAPI key
  TRIPADVISOR_API_KEY: process.env.EXPO_PUBLIC_TRIPADVISOR_API_KEY ?? '92bc1b4fc7mshacea9f118bf7a3fp1b5a6cjsnd2287a72fcb9', // TripAdvisor API key
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? 'your-google-maps-api-key', // Loaded from .env
};

// API Timeout
export const API_TIMEOUT = 10000; // 10 seconds

// App Constants
export const APP_CONSTANTS = {
  DEFAULT_RADIUS: 10, // km
  DEFAULT_PAGE_SIZE: 20,
  MAX_SEARCH_RESULTS: 100,
  DEFAULT_LOCATION: { latitude: 40.7128, longitude: -74.0060 }, // New York City
};

// Validation Constants
export const VALIDATION = {
  MIN_USERNAME_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 8,
  MAX_SEARCH_QUERY_LENGTH: 100,
  MAX_REVIEW_LENGTH: 500,
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_LATITUDE: 40.7128, // New York City
  DEFAULT_LONGITUDE: -74.0060,
  DEFAULT_ZOOM: 12,
  DEFAULT_RADIUS: 10, // km
};

// Mapbox Configuration
export const MAPBOX_CONFIG = {
  PUBLIC_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN ?? 'pk.eyJ1IjoidHJhcHBhdCIsImEiOiJjbTMzODBqYTYxbHcwMmpwdXpxeWljNXJ3In0.xKUEW2C1kjFBu7kr7Uxfow',
  SECRET_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_SECRET_TOKEN ?? 'sk.eyJ1IjoidHJhcHBhdCIsImEiOiJjbTlkNWV1NjQweGtnMmxvZHZpZ2YxemNsIn0.XLC9aOmpLzahzcaAYis0Eg',
  STYLE_URL: 'mapbox://styles/mapbox/streets-v12', // Default style
  ENABLE_OFFLINE_MAPS: false, // Set to true to enable offline map downloads
};

// UI Configuration
export const UI_CONFIG = {
  THEME_COLOR_PRIMARY: '#4299E1', // Blue
  THEME_COLOR_SECONDARY: '#805AD5', // Purple
  THEME_COLOR_ACCENT: '#F6AD55', // Orange
  ANIMATION_DURATION: 300, // ms
};

// Feature Flags
export const FEATURES = {
  ENABLE_REVIEWS: true,
  ENABLE_FAVORITES: true,
  ENABLE_ITINERARY: false, // Coming soon
  ENABLE_SOCIAL_SHARING: true,
  ENABLE_OFFLINE_MODE: false, // Coming soon
};

// Cache Configuration
export const CACHE_CONFIG = {
  ACTIVITIES_TTL: 60 * 60 * 1000, // 1 hour in milliseconds
  SEARCH_RESULTS_TTL: 30 * 60 * 1000, // 30 minutes
  MAX_SEARCH_HISTORY: 10,
};

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  ENABLE_ANALYTICS: true,
  TRACK_SEARCH: true,
  TRACK_ACTIVITY_VIEWS: true,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please sign in again.',
  GENERAL_ERROR: 'Something went wrong. Please try again later.',
  LOCATION_PERMISSION_DENIED: 'Location permission denied. Some features may not work properly.',
};

// Default export for convenience
export default {
  API_CONFIG,
  AUTH_CONFIG,
  VALIDATION,
  MAP_CONFIG,
  MAPBOX_CONFIG,
  UI_CONFIG,
  FEATURES,
  CACHE_CONFIG,
  ANALYTICS_CONFIG,
  ERROR_MESSAGES,
};
