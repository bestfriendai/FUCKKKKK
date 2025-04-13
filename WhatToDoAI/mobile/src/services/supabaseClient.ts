// WhatToDoAI/mobile/src/services/supabaseClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AUTH_CONFIG } from '../config'; // Use AUTH_CONFIG for Supabase credentials

const supabaseUrl = AUTH_CONFIG.SUPABASE_URL;
const supabaseAnonKey = AUTH_CONFIG.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL or Anon Key is missing. Make sure they are set in your environment variables and config file.'
  );
  // You might want to throw an error here in a real app
}

console.log('Supabase URL used:', supabaseUrl);
console.log('Supabase Anon Key used (first 10 chars):', supabaseAnonKey?.substring(0, 10));
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