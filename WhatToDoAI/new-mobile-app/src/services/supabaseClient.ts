// WhatToDoAI/new-mobile-app/src/services/supabaseClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { API_KEYS } from '../config'; // Assuming config is in src/config

const supabaseUrl = API_KEYS.SUPABASE_URL;
const supabaseAnonKey = API_KEYS.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL or Anon Key is missing. Make sure they are set in your environment variables and config file.'
  );
  // You might want to throw an error here in a real app
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Use AsyncStorage for React Native
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native
  },
});

// Function to get the current user session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
  return data.session;
};

// Function to get the current user
export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
   if (error) {
    console.error('Error getting user:', error.message);
    return null;
  }
  return data.user;
}
