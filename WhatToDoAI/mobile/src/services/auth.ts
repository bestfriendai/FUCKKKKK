// WhatToDoAI/mobile/src/services/auth.ts

import { supabase } from './supabaseClient';
import { SignInCredentials, SignUpCredentials } from '../types/auth'; // Assuming types are defined here

/**
  * Signs up a new user with email and password.
  * Additional metadata like username can be passed via options.
  */
export const signUp = async ({ email, password, username }: SignUpCredentials) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: username, // This will be available in the handle_new_user function
                // Add other metadata if needed, e.g., full_name
            },
        },
    });

    if (error) {
        console.error('Sign up error:', error.message);
        // Consider throwing a more specific error or returning a structured error object
        throw new Error(error.message || 'Sign up failed');
    }

    // Note: Supabase sends a confirmation email by default.
    // The user needs to click the link in the email to confirm their account.
    // The session might be null until confirmation.
    return { user: data.user, session: data.session };
};

/**
  * Signs in a user with email and password.
  */
export const signIn = async ({ email, password }: SignInCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Sign in error:', error.message);
        throw new Error(error.message || 'Sign in failed');
    }

    return { user: data.user, session: data.session };
};

/**
  * Signs out the current user.
  */
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Sign out error:', error.message);
        throw new Error(error.message || 'Sign out failed');
    }

    console.log('User signed out successfully');
    return { success: true };
};

/**
  * Sends a password reset email to the user.
  */
export const sendPasswordResetEmail = async (email: string) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                // Optional: Redirect URL after password reset
                // redirectTo: 'yourapp://password-reset-callback',
        });

        if (error) {
                console.error('Password reset error:', error.message);
                throw new Error(error.message || 'Failed to send password reset email');
        }

        return { success: true };
};

// Add other auth functions as needed (e.g., updatePassword, updateUser, OAuth sign-in)
