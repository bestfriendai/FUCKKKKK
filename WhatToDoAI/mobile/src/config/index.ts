// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.whattodoai.com/v1';
export const API_TIMEOUT = 30000; // 30 seconds

// API Keys (Should be stored in .env file and not committed)
export const API_KEYS = {
  EVENTBRITE_TOKEN: process.env.EXPO_PUBLIC_EVENTBRITE_TOKEN || 'EUB5KUFLJH2SKVCHVD3E', // Replace with actual env var
  TRIPADVISOR_API_KEY: process.env.EXPO_PUBLIC_TRIPADVISOR_API_KEY || '92bc1b4fc7mshacea9f118bf7a3fp1b5a6cjsnd2287a72fcb9', // Replace with actual env var
  RAPIDAPI_KEY: process.env.EXPO_PUBLIC_RAPIDAPI_KEY || '33351bd536msha426eb3e02f04cdp1c6c75jsnb775e95605b8', // Replace with actual env var
  SERPAPI_KEY: process.env.EXPO_PUBLIC_SERPAPI_KEY || '18596fbf4a660faf2c48ceca0c19c385eba49ba054fc4db6ab1bb541d8f73c5d', // Replace with actual env var
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://todtibssabkyiqoaylqo.supabase.co',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZHRpYnNzYWJreWlxb2F5bHFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjAyNzcsImV4cCI6MjA1OTk5NjI3N30.yEAVvLirhthkxSKMTAJWYe1Db7qwhlCQb67Z8GoBkBc',
  MAPBOX_ACCESS_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoidHJhcHBhdCIsImEiOiJjbTMzODBqYTYxbHcwMmpwdXpxeWljNXJ3In0.xKUEW2C1kjFBu7kr7Uxfow', // Add your Mapbox token
  AI_API_ENDPOINT: process.env.EXPO_PUBLIC_AI_API_ENDPOINT || 'https://your-ai-api.com/v1', // Replace with actual AI endpoint
};

// Feature Flags
export const FEATURES = {
  AI_RECOMMENDATIONS: true,
  SOCIAL_SHARING: true,
  OFFLINE_SUPPORT: true,
  ANALYTICS_ENABLED: process.env.EXPO_PUBLIC_ENVIRONMENT !== 'development',
};

// App Constants
export const APP_CONSTANTS = {
  DEFAULT_RADIUS: 10, // kilometers
  MAX_RADIUS: 50, // kilometers
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  IMAGE_QUALITY: 0.8,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  CACHE_DURATION: 15 * 60 * 1000, // 15 minutes
  LOCATION_UPDATE_INTERVAL: 5 * 60 * 1000, // 5 minutes
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  LOCATION_PERMISSION_DENIED: 'Location permission is required to show activities near you.',
  GENERAL_ERROR: 'Something went wrong. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
};

// Validation Constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 1000,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  VIEW_ACTIVITY: 'view_activity',
  SEARCH_ACTIVITIES: 'search_activities',
  BOOK_ACTIVITY: 'book_activity',
  SHARE_ACTIVITY: 'share_activity',
  CREATE_ITINERARY: 'create_itinerary',
  UPDATE_PREFERENCES: 'update_preferences',
};
