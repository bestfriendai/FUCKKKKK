// WhatToDoAI/web/src/services/activities.ts

import axios from 'axios';
import { API_KEYS, APP_CONSTANTS, API_TIMEOUT } from '../config';
import { Activity, ActivitySearchParams, AISummary } from '../types/activity';
import { supabase } from './supabaseClient';

const EVENTBRITE_API_URL = 'https://www.eventbriteapi.com/v3/events/search/';
const EVENTBRITE_EVENT_URL = 'https://www.eventbriteapi.com/v3/events/';
const TRIPADVISOR_API_URL = 'https://tripadvisor16.p.rapidapi.com/api/v1/attractions/searchAttraction';
const TRIPADVISOR_DETAILS_URL = 'https://tripadvisor16.p.rapidapi.com/api/v1/attractions/getAttractionDetails';

/**
 * Fetches activities from the Eventbrite API.
 */
export const fetchEventbriteActivities = async (params: ActivitySearchParams): Promise<Activity[] | null> => {
  const {
    location,
    query,
    categories,
    startDate,
    endDate,
    page = 1,
    pageSize = APP_CONSTANTS.DEFAULT_PAGE_SIZE,
  } = params;

  const apiParams: any = {
    'location.latitude': location.latitude,
    'location.longitude': location.longitude,
    'location.within': `${location.radius || APP_CONSTANTS.DEFAULT_RADIUS}km`,
    'expand': 'venue,category,format,organizer,ticket_availability',
    'page': page,
    'page_size': pageSize,
    'token': API_KEYS.EVENTBRITE_TOKEN,
  };

  if (query) apiParams.q = query;
  if (categories && categories.length > 0) apiParams.categories = categories.join(',');
  if (startDate) apiParams['start_date.range_start'] = new Date(startDate).toISOString().slice(0, 19) + 'Z';
  if (endDate) {
    apiParams['start_date.range_end'] = new Date(endDate).toISOString().slice(0, 19) + 'Z';
  } else {
    apiParams['start_date.keyword'] = 'today';
  }

  try {
    console.log('Fetching Eventbrite with params:', apiParams);
    const response = await axios.get(EVENTBRITE_API_URL, {
      params: apiParams,
      headers: {
        'Authorization': `Bearer ${API_KEYS.EVENTBRITE_TOKEN}`,
        'Accept': 'application/json',
      },
      timeout: API_TIMEOUT,
    });

    console.log('Eventbrite Response Status:', response.status);

    if (response.data && response.data.events) {
      const activities: Activity[] = response.data.events.map((event: any) => ({
        activity_id: `eventbrite-${event.id}`,
        source: 'Eventbrite',
        name: event.name?.text || 'Unnamed Event',
        description: event.description?.text || event.summary || '',
        start_time: event.start?.utc ? new Date(event.start.utc).toISOString() : undefined,
        end_time: event.end?.utc ? new Date(event.end.utc).toISOString() : undefined,
        image_urls: event.logo?.original?.url ? [event.logo.original.url] : [],
        activity_url: event.url || '',
        venue: event.venue ? {
          venue_id: `eventbrite-venue-${event.venue.id}`,
          name: event.venue.name || '',
          address: event.venue.address?.localized_address_display || '',
          latitude: parseFloat(event.venue.latitude),
          longitude: parseFloat(event.venue.longitude),
        } : undefined,
        category: event.category ? {
          category_id: `eventbrite-cat-${event.category.id}`,
          name: event.category.name || '',
        } : undefined,
        price_info: event.ticket_availability?.minimum_ticket_price?.display || 'Check website',
        organizer_name: event.organizer?.name || '',
        tags: event.tags?.map((tag: any) => tag.display_name) || [],
        is_free: event.is_free || false,
        aiSummary: null,
        average_rating: null,
        review_count: null,
      }));
      return activities;
    } else {
      console.warn('No events found in Eventbrite response');
      return [];
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching Eventbrite activities:', error.response?.status, error.response?.data || error.message);
    } else {
      console.error('Error fetching Eventbrite activities:', error.message);
    }
    return null;
  }
};

/**
 * Fetches activities from the TripAdvisor API (via RapidAPI).
 */
export const fetchTripAdvisorActivities = async (params: ActivitySearchParams): Promise<Activity[] | null> => {
  const {
    location,
    query,
    page = 1,
    pageSize = APP_CONSTANTS.DEFAULT_PAGE_SIZE,
  } = params;

  try {
    const apiParams: any = {
      locationId: '', // We'll use lat/long instead
      latLong: `${location.latitude},${location.longitude}`,
      radius: location.radius || APP_CONSTANTS.DEFAULT_RADIUS,
      searchQuery: query || '',
      page: page,
      pageSize: pageSize,
    };

    console.log('Fetching TripAdvisor with params:', apiParams);
    const response = await axios.get(TRIPADVISOR_API_URL, {
      params: apiParams,
      headers: {
        'X-RapidAPI-Key': API_KEYS.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      },
      timeout: API_TIMEOUT,
    });

    console.log('TripAdvisor Response Status:', response.status);

    if (response.data && response.data.data) {
      const activities: Activity[] = response.data.data.map((item: any) => ({
        activity_id: `tripadvisor-${item.locationId}`,
        source: 'TripAdvisor',
        name: item.title || 'Unnamed Attraction',
        description: item.description || '',
        image_urls: item.thumbnail ? [item.thumbnail.urlTemplate.replace('{width}', '800').replace('{height}', '600')] : [],
        activity_url: item.website || '',
        venue: {
          venue_id: `tripadvisor-venue-${item.locationId}`,
          name: item.title || '',
          address: item.address || '',
          city: item.addressObj?.city || '',
          state: item.addressObj?.state || '',
          country: item.addressObj?.country || '',
          latitude: item.latitude,
          longitude: item.longitude,
        },
        average_rating: item.averageRating || null,
        review_count: item.numberOfReviews || null,
        tags: item.subcategory?.map((cat: any) => cat.name) || [],
        price_info: item.priceLevel || 'Check website',
        aiSummary: null,
      }));
      return activities;
    } else {
      console.warn('No attractions found in TripAdvisor response');
      return [];
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching TripAdvisor activities:', error.response?.status, error.response?.data || error.message);
    } else {
      console.error('Error fetching TripAdvisor activities:', error.message);
    }
    return null;
  }
};

/**
 * Searches for activities by calling relevant external APIs.
 */
export const searchActivities = async (params: ActivitySearchParams): Promise<Activity[] | null> => {
  try {
    const eventbriteResults = await fetchEventbriteActivities(params);
    const tripadvisorResults = await fetchTripAdvisorActivities(params);

    const combinedResults = [
      ...(eventbriteResults || []),
      ...(tripadvisorResults || []),
    ];

    // Simple de-duplication
    const uniqueResults = Array.from(new Map(combinedResults.map(item => [`${item.name}-${item.venue?.latitude}-${item.venue?.longitude}`, item])).values());

    return uniqueResults;
  } catch (error) {
    console.error('Error in searchActivities:', error);
    return null;
  }
};

/**
 * Generates an AI summary for an activity using the AI API.
 */
const generateAISummary = async (activity: Activity): Promise<AISummary | null> => {
  try {
    // Check if we already have a summary in Supabase
    const { data: existingSummary } = await supabase
      .from('ai_summaries')
      .select('*')
      .eq('activity_id', activity.activity_id)
      .single();

    if (existingSummary) {
      console.log('Found existing AI summary for activity:', activity.activity_id);
      return existingSummary.summary as AISummary;
    }

    // If no existing summary, generate a new one
    console.log('Generating new AI summary for activity:', activity.activity_id);
    
    // This would be a call to your AI service
    // For now, we'll create a mock summary
    const mockSummary: AISummary = {
      highlights: [
        'Popular among locals and tourists alike',
        'Known for its unique atmosphere',
        'Great for photography enthusiasts'
      ],
      atmosphere: 4,
      familyFriendliness: activity.name.toLowerCase().includes('family') ? 5 : 3,
      priceValue: activity.is_free ? 5 : 4,
      bestTimeToVisit: 'Weekday mornings or late afternoons',
      crowdLevel: 3,
      overview: `${activity.name} offers visitors a unique experience in ${activity.venue?.city || 'the area'}. ${activity.description?.substring(0, 100) || ''}...`,
      tips: [
        'Book in advance to avoid disappointment',
        'Arrive early to avoid crowds',
        'Check the weather forecast before visiting'
      ],
      idealFor: [
        'Couples',
        'Solo travelers',
        'Small groups'
      ],
      localInsights: 'Locals recommend visiting nearby cafes after your experience.'
    };

    // Store the summary in Supabase for future use
    await supabase
      .from('ai_summaries')
      .insert({
        activity_id: activity.activity_id,
        summary: mockSummary,
        created_at: new Date().toISOString()
      });

    return mockSummary;
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return null;
  }
};

/**
 * Gets details for a single activity by ID and source.
 */
export const getActivityDetails = async (activityId: string, source: 'Eventbrite' | 'TripAdvisor'): Promise<Activity | null> => {
  console.log(`Fetching details for ${source} ID: ${activityId}`);
  
  try {
    let activity: Activity | null = null;
    
    if (source === 'Eventbrite') {
      // Extract the actual Eventbrite ID from our composite ID
      const eventbriteId = activityId.replace('eventbrite-', '');
      
      const response = await axios.get(`${EVENTBRITE_EVENT_URL}${eventbriteId}/`, {
        params: {
          'expand': 'venue,category,format,organizer,ticket_availability',
          'token': API_KEYS.EVENTBRITE_TOKEN,
        },
        headers: {
          'Authorization': `Bearer ${API_KEYS.EVENTBRITE_TOKEN}`,
          'Accept': 'application/json',
        },
        timeout: API_TIMEOUT,
      });
      
      if (response.data) {
        const event = response.data;
        activity = {
          activity_id: `eventbrite-${event.id}`,
          source: 'Eventbrite',
          name: event.name?.text || 'Unnamed Event',
          description: event.description?.text || event.summary || '',
          shortDescription: event.summary || event.description?.text?.substring(0, 150) || '',
          start_time: event.start?.utc ? new Date(event.start.utc).toISOString() : undefined,
          end_time: event.end?.utc ? new Date(event.end.utc).toISOString() : undefined,
          image_urls: event.logo?.original?.url ? [event.logo.original.url] : [],
          activity_url: event.url || '',
          venue: event.venue ? {
            venue_id: `eventbrite-venue-${event.venue.id}`,
            name: event.venue.name || '',
            address: event.venue.address?.localized_address_display || '',
            city: event.venue.address?.city || '',
            state: event.venue.address?.region || '',
            country: event.venue.address?.country || '',
            postalCode: event.venue.address?.postal_code || '',
            latitude: parseFloat(event.venue.latitude),
            longitude: parseFloat(event.venue.longitude),
          } : undefined,
          category: event.category ? {
            category_id: `eventbrite-cat-${event.category.id}`,
            name: event.category.name || '',
          } : undefined,
          price_info: event.ticket_availability?.minimum_ticket_price?.display || 'Check website',
          organizer_name: event.organizer?.name || '',
          tags: event.tags?.map((tag: any) => tag.display_name) || [],
          is_free: event.is_free || false,
          bookingUrl: event.url,
          bookingRequired: true,
          features: ['Online booking available', 'Instant confirmation'],
          average_rating: null,
          review_count: null,
        };
      }
    } else if (source === 'TripAdvisor') {
      // Extract the actual TripAdvisor ID from our composite ID
      const tripAdvisorId = activityId.replace('tripadvisor-', '');
      
      const response = await axios.get(TRIPADVISOR_DETAILS_URL, {
        params: {
          locationId: tripAdvisorId,
        },
        headers: {
          'X-RapidAPI-Key': API_KEYS.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
        },
        timeout: API_TIMEOUT,
      });
      
      if (response.data && response.data.data) {
        const attraction = response.data.data;
        activity = {
          activity_id: `tripadvisor-${attraction.locationId}`,
          source: 'TripAdvisor',
          name: attraction.title || 'Unnamed Attraction',
          description: attraction.description || '',
          shortDescription: attraction.description?.substring(0, 150) || '',
          image_urls: attraction.photos?.map((photo: any) => 
            photo.urlTemplate.replace('{width}', '800').replace('{height}', '600')
          ) || [],
          activity_url: attraction.website || '',
          venue: {
            venue_id: `tripadvisor-venue-${attraction.locationId}`,
            name: attraction.title || '',
            address: attraction.address || '',
            city: attraction.addressObj?.city || '',
            state: attraction.addressObj?.state || '',
            country: attraction.addressObj?.country || '',
            postalCode: attraction.addressObj?.postalCode || '',
            latitude: attraction.latitude,
            longitude: attraction.longitude,
            phone: attraction.phone || '',
            website: attraction.website || '',
          },
          average_rating: attraction.averageRating || null,
          review_count: attraction.numberOfReviews || null,
          tags: attraction.subcategory?.map((cat: any) => cat.name) || [],
          features: attraction.amenities || [],
          price_info: attraction.priceLevel || 'Check website',
          openingHours: attraction.hours?.weekday?.map((day: any, index: number) => ({
            day: index,
            open: day.open,
            close: day.close,
          })) || [],
          bookingUrl: attraction.bookingUrl || attraction.website,
          bookingRequired: !!attraction.bookingUrl,
        };
      }
    }
    
    // If we found an activity, generate an AI summary for it
    if (activity) {
      activity.aiSummary = await generateAISummary(activity);
    }
    
    return activity;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching ${source} activity details:`, error.response?.status, error.response?.data || error.message);
    } else {
      console.error(`Error fetching ${source} activity details:`, error.message);
    }
    return null;
  }
};

export default {
  fetchEventbriteActivities,
  fetchTripAdvisorActivities,
  searchActivities,
  getActivityDetails,
};
