/**
 * Authentication service
 */

import { 
  AuthResponse, 
  SignInCredentials, 
  SignUpCredentials, 
  User, 
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest
} from '../types/auth';
import { get, post, put, uploadFile } from './api';
import { STORAGE_KEYS } from '../utils/storage';

// API endpoints
const AUTH_ENDPOINTS = {
  SIGN_UP: '/auth/signup',
  SIGN_IN: '/auth/signin',
  SIGN_OUT: '/auth/signout',
  REFRESH_TOKEN: '/auth/refresh',
  CURRENT_USER: '/auth/me',
  UPDATE_PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  UPLOAD_AVATAR: '/auth/avatar',
};

/**
 * Sign up a new user
 * @param credentials - User signup credentials
 * @returns Promise with auth response
 */
export const signUp = async (credentials: SignUpCredentials): Promise<AuthResponse> => {
  const response = await post<AuthResponse>(AUTH_ENDPOINTS.SIGN_UP, credentials);
  
  // Store auth token and user data
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
  
  return response;
};

/**
 * Sign in an existing user
 * @param credentials - User signin credentials
 * @returns Promise with auth response
 */
export const signIn = async (credentials: SignInCredentials): Promise<AuthResponse> => {
  const response = await post<AuthResponse>(AUTH_ENDPOINTS.SIGN_IN, credentials);
  
  // Store auth token and user data
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
  
  return response;
};

/**
 * Sign out the current user
 * @returns Promise<void>
 */
export const signOut = async (): Promise<void> => {
  try {
    // Call the signout endpoint
    await post(AUTH_ENDPOINTS.SIGN_OUT);
  } catch (error) {
    console.error('Error signing out:', error);
  } finally {
    // Clear auth token and user data regardless of API call success
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
};

/**
 * Get the current authenticated user
 * @returns Promise with user data or null if not authenticated
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Check if we have a token
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      return null;
    }
    
    // Get user data from API
    const user = await get<User>(AUTH_ENDPOINTS.CURRENT_USER);
    
    // Update stored user data
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Update user profile
 * @param userData - Updated user data
 * @returns Promise with updated user
 */
export const updateProfile = async (userData: UpdateProfileRequest): Promise<User> => {
  let user: User;
  
  // If profile picture is included, upload it separately
  if (userData.profilePicture) {
    const { profilePicture, ...otherData } = userData;
    
    // First update other profile data
    if (Object.keys(otherData).length > 0) {
      user = await put<User>(AUTH_ENDPOINTS.UPDATE_PROFILE, otherData);
    } else {
      // Get current user if no other data to update
      user = await getCurrentUser() as User;
    }
    
    // Then upload profile picture
    user = await uploadFile<User>(
      AUTH_ENDPOINTS.UPLOAD_AVATAR,
      profilePicture,
      'avatar'
    );
  } else {
    // Update profile without picture
    user = await put<User>(AUTH_ENDPOINTS.UPDATE_PROFILE, userData);
  }
  
  // Update stored user data
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  
  return user;
};

/**
 * Change user password
 * @param passwordData - Password change data
 * @returns Promise<void>
 */
export const changePassword = async (passwordData: ChangePasswordRequest): Promise<void> => {
  await put(AUTH_ENDPOINTS.CHANGE_PASSWORD, passwordData);
};

/**
 * Request password reset
 * @param resetData - Password reset request data
 * @returns Promise<void>
 */
export const forgotPassword = async (resetData: ResetPasswordRequest): Promise<void> => {
  await post(AUTH_ENDPOINTS.FORGOT_PASSWORD, resetData);
};

/**
 * Reset password with token
 * @param token - Reset token
 * @param newPassword - New password
 * @returns Promise<void>
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
};

/**
 * Check if user is authenticated
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return !!token;
};

/**
 * Get cached user data
 * @returns User object or null
 */
export const getCachedUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

export default {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  isAuthenticated,
  getCachedUser,
};