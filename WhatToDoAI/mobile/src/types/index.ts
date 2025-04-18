// WhatToDoAI/mobile/src/types/index.ts

// Re-export all types from their respective files
export * from './activity';
export * from './auth';
export * from './itinerary';

// Common types used across the app

export interface Location {
  latitude: number;
  longitude: number;
  radius?: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems?: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  pagination?: Pagination;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface SearchParams {
  query?: string;
  location?: Location;
  category?: string;
  startDate?: string;
  endDate?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  sortBy?: 'relevance' | 'distance' | 'price' | 'rating' | 'date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  featured?: boolean;
  freeOnly?: boolean;
}
