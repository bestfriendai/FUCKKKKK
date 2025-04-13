// WhatToDoAI/mobile/src/types/env.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_SUPABASE_URL: string;
    EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
    EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN: string;
    EXPO_PUBLIC_MAPBOX_SECRET_TOKEN: string;
    EXPO_PUBLIC_EVENTBRITE_TOKEN: string;
    EXPO_PUBLIC_EVENTBRITE_PUBLIC_TOKEN: string;
    EXPO_PUBLIC_RAPIDAPI_KEY: string;
    EXPO_PUBLIC_TRIPADVISOR_API_KEY: string;
    EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: string;
    EXPO_PUBLIC_ENVIRONMENT: string;
  }
}
