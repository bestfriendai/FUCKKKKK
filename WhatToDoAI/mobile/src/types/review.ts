// WhatToDoAI/mobile/src/types/review.ts

export interface Review {
  review_id: string;
  activity_id: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  rating: number; // 1-5 stars
  title?: string;
  content: string;
  created_at: string; // ISO date string
  updated_at?: string; // ISO date string
  helpful_count?: number;
  photos?: string[]; // URLs to photos
  source?: 'app' | 'tripadvisor' | 'eventbrite' | string; // Source of the review

  // For backward compatibility
  id?: string;
  activityId?: string;
  userId?: string;
  comment?: string;
  createdAt?: string;
  authorName?: string;
  authorAvatarUrl?: string;
}

export default Review;
