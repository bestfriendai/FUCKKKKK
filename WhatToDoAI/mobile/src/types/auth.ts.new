// WhatToDoAI/mobile/src/types/auth.ts


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
