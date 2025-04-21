/**
 * Admin API Service
 * Handles all admin-related API calls
 */

const API_URL = 'http://localhost:5000/api';

/**
 * Helper function to make API requests with admin authentication
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {Object} data - Request data
 * @returns {Promise} - API response
 */
const fetchWithAuth = async (endpoint, method = 'GET', data = null) => {
  // Get admin user from localStorage
  const adminUser = JSON.parse(localStorage.getItem('adminUser'));
  
  if (!adminUser) {
    throw new Error('Not authenticated');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'User-ID': adminUser.id.toString()
  };
  
  const options = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Admin API Error:', error);
    throw error;
  }
};

/**
 * Get admin settings
 * @returns {Promise} - Admin settings
 */
export const getAdminSettings = async () => {
  return fetchWithAuth('/admin/settings');
};

/**
 * Update admin settings
 * @param {Object} settings - Updated settings
 * @returns {Promise} - Updated admin settings
 */
export const updateAdminSettings = async (settings) => {
  return fetchWithAuth('/admin/settings', 'PUT', settings);
};

/**
 * Get admin activity log
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} - Admin activity log
 */
export const getAdminActivity = async (page = 1, limit = 20) => {
  return fetchWithAuth(`/admin/activity?page=${page}&limit=${limit}`);
};

/**
 * Get admin dashboard stats
 * @returns {Promise} - Admin dashboard stats
 */
export const getAdminStats = async () => {
  return fetchWithAuth('/admin/stats');
};

/**
 * Get all products
 * @returns {Promise} - Products list
 */
export const getProducts = async () => {
  return fetchWithAuth('/products');
};

/**
 * Get a product by ID
 * @param {number} id - Product ID
 * @returns {Promise} - Product details
 */
export const getProduct = async (id) => {
  return fetchWithAuth(`/products/${id}`);
};

/**
 * Create a new product
 * @param {Object} product - Product data
 * @returns {Promise} - Created product
 */
export const createProduct = async (product) => {
  return fetchWithAuth('/products', 'POST', product);
};

/**
 * Update a product
 * @param {number} id - Product ID
 * @param {Object} product - Updated product data
 * @returns {Promise} - Updated product
 */
export const updateProduct = async (id, product) => {
  return fetchWithAuth(`/products/${id}`, 'PUT', product);
};

/**
 * Delete a product
 * @param {number} id - Product ID
 * @returns {Promise} - Deleted product
 */
export const deleteProduct = async (id) => {
  return fetchWithAuth(`/products/${id}`, 'DELETE');
};

/**
 * Get all orders
 * @returns {Promise} - Orders list
 */
export const getOrders = async () => {
  return fetchWithAuth('/orders');
};

/**
 * Get all users (excluding admins)
 * @returns {Promise} - Users list
 */
export const getUsers = async () => {
  // This is a mock implementation since we don't have a dedicated endpoint
  // In a real app, we would have a proper endpoint for this
  const allUsers = await fetchWithAuth('/users');
  return allUsers.filter(user => user.role !== 'admin');
};

/**
 * Error handler for admin API calls
 * @param {Error} error - Error object
 * @returns {Object} - Formatted error
 */
export const handleApiError = (error) => {
  console.error('Admin API Error:', error);
  
  return {
    message: error.message || 'An unexpected error occurred',
    status: error.status || 500
  };
};
