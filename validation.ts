/**
 * Validation utility functions
 */

/**
 * Validates an email address
 * @param email - Email address to validate
 * @returns True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password
 * @param password - Password to validate
 * @returns True if the password is valid, false otherwise
 */
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates a username
 * @param username - Username to validate
 * @returns True if the username is valid, false otherwise
 */
export const isValidUsername = (username: string): boolean => {
  // 3-20 characters, alphanumeric, underscores, hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validates a name (first name, last name)
 * @param name - Name to validate
 * @returns True if the name is valid, false otherwise
 */
export const isValidName = (name: string): boolean => {
  // Letters, spaces, hyphens, apostrophes, at least 2 characters
  const nameRegex = /^[a-zA-Z\s'-]{2,}$/;
  return nameRegex.test(name);
};

/**
 * Validates a phone number
 * @param phone - Phone number to validate
 * @returns True if the phone number is valid, false otherwise
 */
export const isValidPhone = (phone: string): boolean => {
  // International format, digits, +, -, spaces
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates a URL
 * @param url - URL to validate
 * @returns True if the URL is valid, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validates a date string
 * @param dateString - Date string to validate (YYYY-MM-DD)
 * @returns True if the date is valid, false otherwise
 */
export const isValidDate = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Validates a time string
 * @param timeString - Time string to validate (HH:MM)
 * @returns True if the time is valid, false otherwise
 */
export const isValidTime = (timeString: string): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(timeString);
};

/**
 * Validates required fields in an object
 * @param data - Object to validate
 * @param requiredFields - Array of required field names
 * @returns Array of missing field names, empty if all required fields are present
 */
export const validateRequiredFields = <T>(
  data: T,
  requiredFields: (keyof T)[]
): (keyof T)[] => {
  return requiredFields.filter(field => !data[field]);
};

/**
 * Validates a form field and returns an error message if invalid
 * @param field - Field name
 * @param value - Field value
 * @param validationRules - Validation rules object
 * @returns Error message or empty string if valid
 */
export const validateField = (
  field: string,
  value: string,
  validationRules: Record<string, (value: string) => boolean>
): string => {
  if (!validationRules[field]) {
    return '';
  }
  
  return validationRules[field](value) ? '' : `Invalid ${field}`;
};

/**
 * Creates a validation schema for form validation
 * @param schema - Validation schema configuration
 * @returns Validation function
 */
export const createValidationSchema = (
  schema: Record<string, {
    validator: (value: string) => boolean;
    errorMessage: string;
  }>
) => {
  return (data: Record<string, string>): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    Object.keys(schema).forEach(field => {
      const value = data[field] || '';
      const { validator, errorMessage } = schema[field];
      
      if (!validator(value)) {
        errors[field] = errorMessage;
      }
    });
    
    return errors;
  };
};

export default {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  isValidName,
  isValidPhone,
  isValidUrl,
  isValidDate,
  isValidTime,
  validateRequiredFields,
  validateField,
  createValidationSchema,
};