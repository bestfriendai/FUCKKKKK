/**
 * Activity related type definitions
 */

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
}

export interface Rating {
  average: number;
  count: number;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Image {
  id: string;
  url: string;
  alt?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  location: Location;
  rating: Rating;
  priceRange?: PriceRange;
  openingHours?: OpeningHours[];
  categories: Category[];
  images: Image[];
  duration?: number; // in minutes
  distance?: number; // in kilometers
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityFilter {
  categories?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  rating?: number;
  distance?: number;
  duration?: number;
  searchQuery?: string;
}

// Additional web-specific types
export interface ActivityReview {
  id: string;
  userId: string;
  username: string;
  profilePicture?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ActivityPageParams {
  page: number;
  limit: number;
  sort?: 'rating' | 'distance' | 'price' | 'popularity';
  order?: 'asc' | 'desc';
}

export interface ActivitySearchResponse {
  activities: Activity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}