// WhatToDoAI/mobile/src/utils/formatters.ts

/**
 * Format a date string to a human-readable format
 */
export const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format a time string to a human-readable format
 */
export const formatTime = (timeString: string | Date | undefined): string => {
  if (!timeString) return 'N/A';
  
  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid Time';
  }
};

/**
 * Format a price to a human-readable format
 */
export const formatPrice = (price: number | string | undefined): string => {
  if (price === undefined || price === null) return 'N/A';
  if (price === 0 || price === '0' || price === 'free' || price === 'Free') return 'Free';
  
  try {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numericPrice.toFixed(2)}`;
  } catch (error) {
    console.error('Error formatting price:', error);
    return 'Invalid Price';
  }
};

/**
 * Format a distance in kilometers to a human-readable format
 */
export const formatDistance = (distanceKm: number | undefined): string => {
  if (distanceKm === undefined || distanceKm === null) return 'N/A';
  
  if (distanceKm < 1) {
    // Convert to meters for distances less than 1 km
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  } else if (distanceKm < 10) {
    // Show one decimal place for distances less than 10 km
    return `${distanceKm.toFixed(1)} km`;
  } else {
    // Round to nearest km for larger distances
    return `${Math.round(distanceKm)} km`;
  }
};
