// WhatToDoAI/web/src/types/itinerary.ts

import { Activity } from './activity';

export interface ItineraryItem {
  item_id: string;
  activity_id: string;
  activity?: Activity; // Denormalized activity data
  itinerary_id: string;
  order: number;
  start_time?: string; // ISO date string
  end_time?: string; // ISO date string
  notes?: string;
  transportation?: 'walking' | 'driving' | 'transit' | 'cycling' | string;
  transportation_time?: number; // in minutes
  transportation_distance?: number; // in meters
}

export interface Itinerary {
  itinerary_id: string;
  user_id: string;
  title: string;
  description?: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  start_date: string; // ISO date string
  end_date?: string; // ISO date string
  items: ItineraryItem[];
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  is_public: boolean;
  cover_image_url?: string;
  tags?: string[];
  total_activities?: number; // Denormalized count
  total_duration?: number; // Denormalized duration in minutes
}

export interface ItineraryDay {
  date: string; // ISO date string (YYYY-MM-DD)
  items: ItineraryItem[];
}

export interface ItineraryFilters {
  userId?: string;
  startDate?: string;
  endDate?: string;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in km
  };
  tags?: string[];
  isPublic?: boolean;
  searchQuery?: string;
}

export default Itinerary;
