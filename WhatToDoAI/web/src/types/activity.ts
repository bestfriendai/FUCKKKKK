// WhatToDoAI/web/src/types/activity.ts

import { Category } from './category';

export interface Venue {
  venue_id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
}

export interface AISummary {
  highlights: string[];
  atmosphere: number; // 1-5 rating
  familyFriendliness: number; // 1-5 rating
  priceValue: number; // 1-5 rating
  bestTimeToVisit: string;
  crowdLevel: number; // 1-5 rating
  overview: string;
  tips: string[];
  idealFor: string[];
  localInsights: string;
}

export interface Activity {
  activity_id: string;
  source: 'Eventbrite' | 'TripAdvisor' | 'Custom' | string;
  name: string;
  description?: string;
  shortDescription?: string;
  start_time?: Date | string;
  end_time?: Date | string;
  image_urls?: string[];
  activity_url?: string;
  venue?: Venue;
  category?: Category;
  price_info?: string;
  organizer_name?: string;
  tags?: string[];
  is_free?: boolean;
  aiSummary?: AISummary | null;
  average_rating?: number | null;
  review_count?: number | null;
  bookingUrl?: string;
  bookingRequired?: boolean;
  features?: string[];
  openingHours?: {
    day: number; // 0-6, where 0 is Sunday
    open: string; // HH:MM format
    close: string; // HH:MM format
  }[];
  
  // For backward compatibility
  imageUrls?: string[];
  latitude?: number;
  longitude?: number;
}

export interface ActivitySearchParams {
  location: {
    latitude: number;
    longitude: number;
    radius?: number; // in km
  };
  query?: string;
  categories?: string[];
  startDate?: Date | string;
  endDate?: Date | string;
  page?: number;
  pageSize?: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
  sortBy?: 'relevance' | 'distance' | 'rating' | 'price';
  filters?: {
    isFree?: boolean;
    hasRating?: boolean;
    minRating?: number;
  };
}

export default Activity;
