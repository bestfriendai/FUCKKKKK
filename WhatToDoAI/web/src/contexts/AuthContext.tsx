// WhatToDoAI/web/src/contexts/AuthContext.tsx

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { 
  AuthState, 
  AuthAction, 
  AuthContextType, 
  SignInCredentials, 
  SignUpCredentials, 
  UserProfile 
} from '../types/auth';
import * as authService from '../services/auth';

// Initial state
const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  error: null,
};

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isLoading: false,
        error: null,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        session: null,
        profile: null,
        isLoading: false,
        error: null,
      };
    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.payload,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            dispatch({ 
              type: 'SIGN_IN', 
              payload: { user, session } 
            });
            
            // Fetch user profile
            await fetchUserProfile(user.id);
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error : new Error('Failed to initialize auth') 
        });
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            dispatch({ 
              type: 'SIGN_IN', 
              payload: { user, session } 
            });
            await fetchUserProfile(user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'SIGN_OUT' });
        }
      }
    );

    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        dispatch({ 
          type: 'SET_PROFILE', 
          payload: data as UserProfile 
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error : new Error('Failed to fetch user profile') 
      });
    }
  };

  // Sign in
  const signIn = async (credentials: SignInCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { user, session } = await authService.signIn(credentials);
      
      if (user && session) {
        dispatch({ 
          type: 'SIGN_IN', 
          payload: { user, session } 
        });
        await fetchUserProfile(user.id);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error : new Error('Failed to sign in') 
      });
      throw error;
    }
  };

  // Sign up
  const signUp = async (credentials: SignUpCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { user, session } = await authService.signUp(credentials);
      
      if (user && session) {
        dispatch({ 
          type: 'SIGN_IN', 
          payload: { user, session } 
        });
        // Note: Profile will be created by Supabase trigger
      }
    } catch (error) {
      console.error('Sign up error:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error : new Error('Failed to sign up') 
      });
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await authService.signOut();
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error('Sign out error:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error : new Error('Failed to sign out') 
      });
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await authService.sendPasswordResetEmail(email);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Reset password error:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error : new Error('Failed to reset password') 
      });
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      if (!state.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        dispatch({ 
          type: 'SET_PROFILE', 
          payload: data as UserProfile 
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error : new Error('Failed to update profile') 
      });
      throw error;
    }
  };

  // Context value
  const value: AuthContextType = {
    state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
