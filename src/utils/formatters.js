/**
 * Utility functions for formatting data
 */

/**
 * Format a date string
 * @param {string} dateString - ISO date string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Default options
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

/**
 * Format a time string
 * @param {string} dateString - ISO date string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted time string
 */
export const formatTime = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Default options
  const defaultOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

/**
 * Format a date and time string
 * @param {string} dateString - ISO date string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date and time string
 */
export const formatDateTime = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Default options
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

/**
 * Format a currency value
 * @param {number} value - Currency value
 * @param {string} currency - Currency code
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', options = {}) => {
  if (value === undefined || value === null) return '';
  
  // Default options
  const defaultOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  };
  
  return new Intl.NumberFormat('en-US', defaultOptions).format(value);
};

/**
 * Format a number
 * @param {number} value - Number value
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} - Formatted number string
 */
export const formatNumber = (value, options = {}) => {
  if (value === undefined || value === null) return '';
  
  // Default options
  const defaultOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  };
  
  return new Intl.NumberFormat('en-US', defaultOptions).format(value);
};

/**
 * Format a percentage
 * @param {number} value - Percentage value (0-100)
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value, options = {}) => {
  if (value === undefined || value === null) return '';
  
  // Default options
  const defaultOptions = {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    ...options
  };
  
  return new Intl.NumberFormat('en-US', defaultOptions).format(value / 100);
};

/**
 * Format a file size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted file size string
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format a phone number
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
  }
  
  // If not a standard format, return as is
  return phone;
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatFileSize,
  formatPhoneNumber
};
