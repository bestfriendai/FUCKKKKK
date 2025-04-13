// src/config/index.ts

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.whattodoai.com/v1';
export const API_TIMEOUT = 30000; // 30 seconds

// API Keys (Should be stored in .env file and not committed)
export const API_KEYS = {
  // Use VITE_ prefix for Vite environment variables
  EVENTBRITE_TOKEN: import.meta.env.VITE_EVENTBRITE_TOKEN || 'EUB5KUFLJH2SKVCHVD3E',
  EVENTBRITE_PUBLIC_TOKEN: import.meta.env.VITE_EVENTBRITE_PUBLIC_TOKEN || 'C4WQAR3XB7XX2AYOUEQ4',
  EVENTBRITE_PRIVATE_TOKEN: import.meta.env.VITE_EVENTBRITE_PRIVATE_TOKEN || 'EUB5KUFLJH2SKVCHVD3E',
  // Note: The user provided multiple Eventbrite tokens (TOKEN, PUBLIC_TOKEN, PRIVATE_TOKEN).
  // Clarify which one is needed for specific API calls if necessary. Using VITE_EVENTBRITE_TOKEN as default.

  TRIPADVISOR_API_KEY: import.meta.env.VITE_TRIPADVISOR_API_KEY || '92bc1b4fc7mshacea9f118bf7a3fp1b5a6cjsnd2287a72fcb9',
  RAPIDAPI_KEY: import.meta.env.VITE_RAPIDAPI_KEY || '33351bd536msha426eb3e02f04cdp1c6c75jsnb775e95605b8', // Assuming a VITE_ prefix might be needed
  SERPAPI_KEY: import.meta.env.VITE_SERPAPI_KEY || '18596fbf4a660faf2c48ceca0c19c385eba49ba054fc4db6ab1bb541d8f73c5d', // Assuming a VITE_ prefix might be needed

  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://todtibssabkyiqoaylqo.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZHRpYnNzYWJreWlxb2F5bHFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjAyNzcsImV4cCI6MjA1OTk5NjI3N30.yEAVvLirhthkxSKMTAJWYe1Db7qwhlCQb67Z8GoBkBc',
  MAPBOX_ACCESS_TOKEN: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoidHJhcHBhdCIsImEiOiJjbTMzODBqYTYxbHcwMmpwdXpxeWljNXJ3In0.xKUEW2C1kjFBu7kr7Uxfow', // Add your Mapbox token
  AI_API_ENDPOINT: import.meta.env.VITE_AI_API_ENDPOINT || 'https://your-ai-api.com/v1', // Replace with actual AI endpoint
};

// Feature Flags
export const FEATURES = {
  AI_RECOMMENDATIONS: true,
  SOCIAL_SHARING: true,
  DARK_MODE: true, // Web specific
  ANALYTICS_ENABLED: import.meta.env.MODE !== 'development',
};

// App Constants
export const APP_CONSTANTS = {
  DEFAULT_RADIUS: 10, // kilometers
  MAX_RADIUS: 50, // kilometers
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  CACHE_DURATION: 15 * 60 * 1000, // 15 minutes
};

// Error Messages (Can share or customize from mobile)
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  LOCATION_PERMISSION_DENIED: 'Location permission is required to show activities near you.',
  GENERAL_ERROR: 'Something went wrong. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
};

// Validation Constants (Can share or customize from mobile)
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 1000,
};

// Analytics Events (Can share or customize from mobile)
export const ANALYTICS_EVENTS = {
  VIEW_ACTIVITY: 'view_activity',
  SEARCH_ACTIVITIES: 'search_activities',
  BOOK_ACTIVITY: 'book_activity',
  SHARE_ACTIVITY: 'share_activity',
  CREATE_ITINERARY: 'create_itinerary',
  UPDATE_PREFERENCES: 'update_preferences',
};

// Ensure environment variables are correctly set up in .env files (.env, .env.development, .env.production)
// Example .env file content:
// VITE_EVENTBRITE_TOKEN=YOUR_EVENTBRITE_TOKEN
// VITE_TRIPADVISOR_API_KEY=YOUR_TRIPADVISOR_KEY
// VITE_SUPABASE_URL=YOUR_SUPABASE_URL
// VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
// VITE_MAPBOX_ACCESS_TOKEN=YOUR_MAPBOX_TOKEN
// VITE_AI_API_ENDPOINT=YOUR_AI_ENDPOINT