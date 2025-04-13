import axios, { AxiosError } from 'axios';
import { ERROR_MESSAGES } from '../config';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  status?: number;
}

export class AppError extends Error {
  code: string;
  details?: Record<string, any>;
  status?: number;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', details?: Record<string, any>, status?: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

/**
 * Handles API errors and transforms them into a consistent format
 */
export function handleApiError(error: unknown, defaultMessage?: string): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    // Handle network errors
    if (!axiosError.response) {
      throw new AppError(
        ERROR_MESSAGES.NETWORK_ERROR,
        'NETWORK_ERROR',
        { originalError: axiosError.message }
      );
    }

    // Handle API error responses
    const status = axiosError.response.status;
    const data = axiosError.response.data as ApiError;

    switch (status) {
      case 400:
        throw new AppError(
          data?.message || 'Invalid request parameters',
          data?.code || 'BAD_REQUEST',
          data?.details,
          status
        );
      
      case 401:
        throw new AppError(
          data?.message || ERROR_MESSAGES.SESSION_EXPIRED,
          'UNAUTHORIZED',
          data?.details,
          status
        );
      
      case 403:
        throw new AppError(
          data?.message || 'Access denied',
          'FORBIDDEN',
          data?.details,
          status
        );
      
      case 404:
        throw new AppError(
          data?.message || 'Resource not found',
          'NOT_FOUND',
          data?.details,
          status
        );
      
      case 422:
        throw new AppError(
          data?.message || 'Validation error',
          'VALIDATION_ERROR',
          data?.details,
          status
        );
      
      case 429:
        throw new AppError(
          'Too many requests. Please try again later.',
          'RATE_LIMIT_EXCEEDED',
          data?.details,
          status
        );
      
      default:
        throw new AppError(
          data?.message || ERROR_MESSAGES.GENERAL_ERROR,
          data?.code || 'API_ERROR',
          data?.details,
          status
        );
    }
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    throw new AppError(
      defaultMessage || error.message,
      'APP_ERROR',
      { originalError: error.message }
    );
  }

  // Handle unknown errors
  throw new AppError(
    defaultMessage || ERROR_MESSAGES.GENERAL_ERROR,
    'UNKNOWN_ERROR',
    { originalError: String(error) }
  );
}

/**
 * Creates a user-friendly error message from an AppError
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return ERROR_MESSAGES.GENERAL_ERROR;
}

/**
 * Logs errors to the error reporting service
 */
export function logError(error: unknown, context?: Record<string, any>): void {
  // TODO: Implement error logging service integration
  console.error('Error:', {
    error,
    context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Determines if an error should trigger a retry
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof AppError) {
    // Retry on network errors and 5xx server errors
    return error.code === 'NETWORK_ERROR' || (error.status ? error.status >= 500 : false);
  }
  
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return !status || status >= 500;
  }
  
  return false;
}
