// WhatToDoAI/web/src/services/supabaseClient.ts
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

// Note: For web, Supabase uses localStorage by default, so no explicit storage option is needed.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Default for web, can be useful for OAuth redirects
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