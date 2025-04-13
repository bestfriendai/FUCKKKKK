// WhatToDoAI/mobile/src/types/activity.ts
import { Location } from './location';
import { Category } from './category';
import { Review } from './review';

export interface PriceRange {
    min?: number;
    max?: number;
    currency?: string;
}

export interface OpeningHours {
    day: number; // 0-6 (Sunday-Saturday)
    open: string; // HH:mm format
    close: string; // HH:mm format
}

export interface Venue {
    venue_id?: string; // Changed from id to match service
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    website?: string;
    capacity?: number;
    accessibility?: string[];
}

// AI-generated summary interface
export interface AISummary {
    highlights?: string[];
    atmosphere?: number;
    familyFriendliness?: number;
    priceValue?: number;
    bestTimeToVisit?: string;
    crowdLevel?: number;
    overview?: string;
    tips?: string[];
    idealFor?: string[];
    localInsights?: string;
}

export interface Activity {
    activity_id: string; // Unique identifier (combined source + source_id)
    name: string;
    description?: string;
    shortDescription?: string;
    category?: Category;
    subCategories?: string[];
    imageUrls?: string[];
    venue?: Venue;
    priceRange?: PriceRange;
    openingHours?: OpeningHours[];
    rating?: number; // Original definition
    reviewCount?: number; // Original definition
    reviews?: Review[];
    tags?: string[];
    features?: string[];
    minimumAge?: number;
    duration?: number; // in minutes
    capacity?: number;
    bookingRequired?: boolean;
    bookingUrl?: string;
    status?: 'active' | 'inactive' | 'soldOut' | 'cancelled';
    createdAt?: string; // Timestamps from DB
    updatedAt?: string; // Timestamps from DB
    startDate?: string; // For events - Original definition
    endDate?: string; // For events - Original definition
    startTime?: string; // Specific start time if applicable (use ISO string) - Original definition
    endTime?: string; // Specific end time if applicable (use ISO string) - Original definition
    source_api?: string; // Track origin API
    source_id?: string; // ID from the origin API
    source_details?: Record<string, any>; // Store raw details from source
    latitude?: number; // Denormalized
    longitude?: number; // Denormalized
    aiSummary?: AISummary; // Using the defined AISummary interface
    
    // Fields added/modified from service mapping
    source?: 'Eventbrite' | 'TripAdvisor' | string;
    activity_url?: string;
    price_info?: string;
    organizer_name?: string;
    is_free?: boolean;
    image_urls?: string[]; // Duplicate from service mapping - using this one
    start_time?: Date; // Date type from service mapping
    end_time?: Date; // Date type from service mapping
    average_rating?: number | null; // Replaces rating?
    review_count?: number | null; // Replaces reviewCount?
}

export interface ActivityFilters {
    categories?: string[];
    priceRange?: { min?: number; max?: number; };
    date?: { start?: Date | string; end?: Date | string; };
    location?: { latitude: number; longitude: number; radius: number; };
    tags?: string[];
    rating?: number; // Minimum rating
    searchQuery?: string;
    sortBy?: 'rating' | 'distance' | 'price' | 'popularity' | 'date';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface ActivitySearchResult {
    activities: Activity[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
}
