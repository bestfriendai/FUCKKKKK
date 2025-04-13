// WhatToDoAI/web/src/services/itinerary.ts

import { supabase } from './supabaseClient';
import { Itinerary, ItineraryItem, ItineraryFilters } from '../types/itinerary';
import { getActivityDetails } from './activities';

/**
 * Fetches all itineraries for a user
 */
export const getUserItineraries = async (userId: string): Promise<Itinerary[]> => {
  try {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data as Itinerary[];
  } catch (error: any) {
    console.error('Error fetching user itineraries:', error.message);
    throw error;
  }
};

/**
 * Fetches a single itinerary by ID
 */
export const getItineraryById = async (itineraryId: string): Promise<Itinerary | null> => {
  try {
    // First get the itinerary
    const { data: itineraryData, error: itineraryError } = await supabase
      .from('itineraries')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .single();

    if (itineraryError) throw itineraryError;
    if (!itineraryData) return null;

    // Then get the items
    const { data: itemsData, error: itemsError } = await supabase
      .from('itinerary_items')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .order('order', { ascending: true });

    if (itemsError) throw itemsError;

    // For each item, fetch the activity details
    const itemsWithActivities = await Promise.all(
      (itemsData || []).map(async (item: ItineraryItem) => {
        // Extract source and ID from the composite activity_id
        const [source, id] = item.activity_id.split('-', 2);
        const activity = await getActivityDetails(item.activity_id, source as any);
        return { ...item, activity };
      })
    );

    return {
      ...itineraryData,
      items: itemsWithActivities,
    } as Itinerary;
  } catch (error: any) {
    console.error('Error fetching itinerary:', error.message);
    throw error;
  }
};

/**
 * Creates a new itinerary
 */
export const createItinerary = async (itinerary: Omit<Itinerary, 'itinerary_id' | 'created_at' | 'updated_at'>): Promise<Itinerary> => {
  try {
    const now = new Date().toISOString();
    const newItinerary = {
      ...itinerary,
      itinerary_id: `itin-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      created_at: now,
      updated_at: now,
    };

    // Insert the itinerary
    const { data, error } = await supabase
      .from('itineraries')
      .insert(newItinerary)
      .select()
      .single();

    if (error) throw error;

    // If there are items, insert them
    if (newItinerary.items && newItinerary.items.length > 0) {
      const itemsToInsert = newItinerary.items.map((item, index) => ({
        ...item,
        item_id: `item-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
        itinerary_id: newItinerary.itinerary_id,
        order: index,
      }));

      const { error: itemsError } = await supabase
        .from('itinerary_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;
    }

    return data as Itinerary;
  } catch (error: any) {
    console.error('Error creating itinerary:', error.message);
    throw error;
  }
};

/**
 * Updates an existing itinerary
 */
export const updateItinerary = async (itineraryId: string, updates: Partial<Itinerary>): Promise<Itinerary> => {
  try {
    const { items, ...itineraryUpdates } = updates;
    
    // Update the itinerary
    const { data, error } = await supabase
      .from('itineraries')
      .update({
        ...itineraryUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq('itinerary_id', itineraryId)
      .select()
      .single();

    if (error) throw error;

    // If items are provided, update them
    if (items && items.length > 0) {
      // First delete all existing items
      const { error: deleteError } = await supabase
        .from('itinerary_items')
        .delete()
        .eq('itinerary_id', itineraryId);

      if (deleteError) throw deleteError;

      // Then insert the new items
      const itemsToInsert = items.map((item, index) => ({
        ...item,
        item_id: item.item_id || `item-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
        itinerary_id: itineraryId,
        order: index,
      }));

      const { error: insertError } = await supabase
        .from('itinerary_items')
        .insert(itemsToInsert);

      if (insertError) throw insertError;
    }

    // Fetch the updated itinerary with items
    return getItineraryById(itineraryId) as Promise<Itinerary>;
  } catch (error: any) {
    console.error('Error updating itinerary:', error.message);
    throw error;
  }
};

/**
 * Deletes an itinerary
 */
export const deleteItinerary = async (itineraryId: string): Promise<void> => {
  try {
    // First delete all items
    const { error: itemsError } = await supabase
      .from('itinerary_items')
      .delete()
      .eq('itinerary_id', itineraryId);

    if (itemsError) throw itemsError;

    // Then delete the itinerary
    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('itinerary_id', itineraryId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting itinerary:', error.message);
    throw error;
  }
};

/**
 * Searches for itineraries based on filters
 */
export const searchItineraries = async (filters: ItineraryFilters): Promise<Itinerary[]> => {
  try {
    let query = supabase
      .from('itineraries')
      .select('*');

    // Apply filters
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters.isPublic !== undefined) {
      query = query.eq('is_public', filters.isPublic);
    }

    if (filters.startDate) {
      query = query.gte('start_date', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('end_date', filters.endDate);
    }

    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
    }

    // Execute the query
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return data as Itinerary[];
  } catch (error: any) {
    console.error('Error searching itineraries:', error.message);
    throw error;
  }
};

/**
 * Generates an AI-powered itinerary based on preferences
 */
export const generateItinerary = async (
  location: { latitude: number; longitude: number; city?: string },
  startDate: string,
  endDate: string,
  preferences: {
    interests?: string[];
    budget?: 'low' | 'medium' | 'high';
    pace?: 'relaxed' | 'balanced' | 'intensive';
  }
): Promise<Itinerary> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // This would be a call to your AI service
    // For now, we'll create a mock itinerary
    const mockItinerary: Omit<Itinerary, 'itinerary_id' | 'created_at' | 'updated_at'> = {
      user_id: user.id,
      title: `${location.city || 'Trip'} Itinerary`,
      description: `An AI-generated itinerary for your trip to ${location.city || 'your destination'}.`,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
      },
      start_date: startDate,
      end_date: endDate,
      items: [], // This would be populated with actual activities
      is_public: false,
      tags: preferences.interests || [],
    };

    // Create the itinerary
    return createItinerary(mockItinerary);
  } catch (error: any) {
    console.error('Error generating itinerary:', error.message);
    throw error;
  }
};

export default {
  getUserItineraries,
  getItineraryById,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  searchItineraries,
  generateItinerary,
};
