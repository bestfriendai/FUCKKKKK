// WhatToDoAI/web/src/types/auth.ts

import { User, Session } from '@supabase/supabase-js';

export interface SignInCredentials {
    email: string;
    password: string;
}

export interface SignUpCredentials extends SignInCredentials {
    username: string; // Required for profile creation
    // Add other optional fields if needed during sign-up, e.g., fullName
    // fullName?: string;
}

// You might also want types for the user profile data
export interface UserProfile {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    updated_at: string | null;
    preferences: {
        interests?: string[];
        budget?: 'low' | 'medium' | 'high';
        pacePreference?: 'relaxed' | 'balanced' | 'intensive';
        // Add other preference fields as needed
    } | null;
}

// Auth state for context
export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
}

// Auth context actions
export type AuthAction =
  | { type: 'SIGN_IN'; payload: { user: User; session: Session } }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null };

// Auth context
export interface AuthContextType {
  state: AuthState;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}
