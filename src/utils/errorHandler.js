/**
 * Centralized error handling utility
 */

/**
 * Standard error response format
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {Object} details - Additional error details
 * @returns {Object} Formatted error object
 */
export const formatError = (message, status = 500, details = null) => {
  return {
    success: false,
    error: message,
    status,
    details
  };
};

/**
 * Handle API errors consistently
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @returns {Object} Formatted error response
 */
export const handleApiError = (error, context) => {
  console.error(`Error in ${context}:`, error);
  
  // Handle Supabase errors
  if (error.code) {
    switch (error.code) {
      case 'PGRST116': // Not found
        return formatError('Resource not found', 404);
      case '23505': // Unique violation
        return formatError('Duplicate entry', 409);
      case '23503': // Foreign key violation
        return formatError('Referenced resource does not exist', 400);
      case '42P01': // Undefined table
        return formatError('Database configuration error', 500);
      case 'P0001': // Raised exception
        return formatError(error.message || 'Database constraint violation', 400);
      case '22P02': // Invalid text representation
        return formatError('Invalid input format', 400);
      case '23502': // Not null violation
        return formatError('Required field missing', 400);
      default:
        // Log unknown error codes for debugging
        console.warn(`Unknown error code: ${error.code}`);
    }
  }

  // Handle authentication errors
  if (error.message?.includes('JWT')) {
    return formatError('Authentication error', 401);
  }

  // Handle network errors
  if (error.message?.includes('Failed to fetch')) {
    return formatError('Network error, please try again', 503);
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return formatError(error.message, 400, error.details);
  }

  // Default error response
  return formatError(
    error.message || 'An unexpected error occurred',
    error.status || 500
  );
};

/**
 * Validate required fields in a request
 * @param {Object} data - The data object to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Object|null} Error object or null if validation passes
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });

  if (missingFields.length > 0) {
    return formatError(
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      { missingFields }
    );
  }

  return null;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  // Basic validation for international phone numbers
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }

  return {
    isValid: true,
    message: 'Password is strong'
  };
};

export default {
  formatError,
  handleApiError,
  validateRequiredFields,
  isValidEmail,
  isValidPhone,
  validatePassword
};
