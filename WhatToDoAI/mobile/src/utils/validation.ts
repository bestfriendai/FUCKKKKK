// WhatToDoAI/mobile/src/utils/validation.ts

/**
 * Validates an email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber;
};

/**
 * Validates that passwords match
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Validates a username
 * - At least 3 characters
 * - Only alphanumeric characters and underscores
 */
export const isValidUsername = (username: string): boolean => {
  if (username.length < 3) return false;
  
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(username);
};

/**
 * Validates a phone number
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Check if the resulting string has 10-15 digits (international numbers can be longer)
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

/**
 * Validates a date string
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Validates required fields
 */
export const isRequiredFieldValid = (value: string | undefined | null): boolean => {
  if (value === undefined || value === null) return false;
  return value.trim().length > 0;
};
