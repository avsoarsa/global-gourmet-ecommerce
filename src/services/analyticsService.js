/**
 * Analytics Service
 * Handles tracking user behavior and analytics data
 */

const API_URL = 'http://localhost:5000/api';

// Event types for tracking
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  PRODUCT_VIEW: 'product_view',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  ADD_PAYMENT_INFO: 'add_payment_info',
  PURCHASE: 'purchase',
  SEARCH: 'search',
  FILTER_PRODUCTS: 'filter_products',
  SORT_PRODUCTS: 'sort_products',
  CLICK_PROMOTION: 'click_promotion',
  VIEW_PROMOTION: 'view_promotion',
  ADD_TO_WISHLIST: 'add_to_wishlist',
  REMOVE_FROM_WISHLIST: 'remove_from_wishlist',
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  SHARE: 'share',
  REVIEW_SUBMIT: 'review_submit',
  CART_VIEW: 'cart_view',
  CHECKOUT_PROGRESS: 'checkout_progress',
  REFUND: 'refund',
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  EXCEPTION: 'exception'
};

// Session storage key
const SESSION_ID_KEY = 'analytics_session_id';
const SESSION_START_KEY = 'analytics_session_start';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Generate a unique session ID
 * @returns {string} - Session ID
 */
const generateSessionId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Get or create a session ID
 * @returns {string} - Session ID
 */
const getSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  const sessionStart = sessionStorage.getItem(SESSION_START_KEY);
  
  // Check if session exists and is still valid
  if (sessionId && sessionStart) {
    const now = Date.now();
    const sessionStartTime = parseInt(sessionStart, 10);
    
    // If session has expired, create a new one
    if (now - sessionStartTime > SESSION_TIMEOUT) {
      sessionId = null;
    }
  }
  
  // If no session ID or expired, create a new one
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    sessionStorage.setItem(SESSION_START_KEY, Date.now().toString());
  }
  
  return sessionId;
};

/**
 * Get user information for analytics
 * @returns {Object} - User information
 */
const getUserInfo = () => {
  // Try to get user from localStorage
  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('Error getting user from localStorage:', error);
  }
  
  return {
    userId: user ? user.id : null,
    isLoggedIn: !!user,
    userType: user ? user.role : 'guest'
  };
};

/**
 * Get device and browser information
 * @returns {Object} - Device and browser information
 */
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // Determine device type
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent.toLowerCase());
  
  let deviceType = 'desktop';
  if (isMobile) deviceType = 'mobile';
  if (isTablet) deviceType = 'tablet';
  
  return {
    userAgent,
    screenWidth,
    screenHeight,
    viewportWidth,
    viewportHeight,
    devicePixelRatio,
    deviceType,
    language: navigator.language || navigator.userLanguage,
    platform: navigator.platform
  };
};

/**
 * Track an analytics event
 * @param {string} eventType - Type of event (from ANALYTICS_EVENTS)
 * @param {Object} eventData - Event data
 * @returns {Promise} - API response
 */
export const trackEvent = async (eventType, eventData = {}) => {
  try {
    const sessionId = getSessionId();
    const userInfo = getUserInfo();
    const deviceInfo = getDeviceInfo();
    const timestamp = new Date().toISOString();
    const url = window.location.href;
    const referrer = document.referrer;
    
    const analyticsData = {
      eventType,
      eventData,
      sessionId,
      timestamp,
      url,
      referrer,
      ...userInfo,
      ...deviceInfo
    };
    
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', analyticsData);
    }
    
    // Send to API
    const response = await fetch(`${API_URL}/analytics/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(analyticsData),
      // Use keepalive to ensure the request completes even if the page is unloading
      keepalive: true
    });
    
    if (!response.ok) {
      throw new Error('Failed to track analytics event');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    
    // Store failed events in localStorage for retry
    storeFailedEvent(eventType, eventData);
    
    return null;
  }
};

/**
 * Store failed event in localStorage for retry
 * @param {string} eventType - Type of event
 * @param {Object} eventData - Event data
 */
const storeFailedEvent = (eventType, eventData) => {
  try {
    const failedEvents = JSON.parse(localStorage.getItem('failedAnalyticsEvents') || '[]');
    
    failedEvents.push({
      eventType,
      eventData,
      timestamp: new Date().toISOString()
    });
    
    // Limit to 100 events to prevent localStorage overflow
    if (failedEvents.length > 100) {
      failedEvents.shift();
    }
    
    localStorage.setItem('failedAnalyticsEvents', JSON.stringify(failedEvents));
  } catch (error) {
    console.error('Error storing failed analytics event:', error);
  }
};

/**
 * Retry sending failed events
 * @returns {Promise} - API response
 */
export const retryFailedEvents = async () => {
  try {
    const failedEvents = JSON.parse(localStorage.getItem('failedAnalyticsEvents') || '[]');
    
    if (failedEvents.length === 0) {
      return { success: true, retried: 0 };
    }
    
    const results = await Promise.allSettled(
      failedEvents.map(event => trackEvent(event.eventType, event.eventData))
    );
    
    // Filter out successful retries
    const newFailedEvents = failedEvents.filter((_, index) => {
      return results[index].status === 'rejected';
    });
    
    localStorage.setItem('failedAnalyticsEvents', JSON.stringify(newFailedEvents));
    
    return {
      success: true,
      retried: failedEvents.length,
      succeeded: failedEvents.length - newFailedEvents.length,
      failed: newFailedEvents.length
    };
  } catch (error) {
    console.error('Error retrying failed analytics events:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Track page view
 * @param {string} pageName - Name of the page
 * @param {Object} pageData - Additional page data
 */
export const trackPageView = (pageName, pageData = {}) => {
  return trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
    pageName,
    ...pageData
  });
};

/**
 * Track product view
 * @param {Object} product - Product data
 */
export const trackProductView = (product) => {
  return trackEvent(ANALYTICS_EVENTS.PRODUCT_VIEW, {
    productId: product.id,
    productName: product.name,
    productCategory: product.category,
    productPrice: product.price,
    currency: product.currency || 'USD'
  });
};

/**
 * Track add to cart
 * @param {Object} product - Product data
 * @param {number} quantity - Quantity added
 */
export const trackAddToCart = (product, quantity = 1) => {
  return trackEvent(ANALYTICS_EVENTS.ADD_TO_CART, {
    productId: product.id,
    productName: product.name,
    productCategory: product.category,
    productPrice: product.price,
    currency: product.currency || 'USD',
    quantity
  });
};

/**
 * Track checkout step
 * @param {string} step - Checkout step
 * @param {Object} checkoutData - Checkout data
 */
export const trackCheckoutStep = (step, checkoutData = {}) => {
  return trackEvent(ANALYTICS_EVENTS.CHECKOUT_PROGRESS, {
    step,
    ...checkoutData
  });
};

/**
 * Track purchase
 * @param {Object} order - Order data
 */
export const trackPurchase = (order) => {
  return trackEvent(ANALYTICS_EVENTS.PURCHASE, {
    orderId: order.id,
    revenue: order.total,
    tax: order.tax,
    shipping: order.shipping,
    currency: order.currency || 'USD',
    coupon: order.coupon,
    items: order.items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      productCategory: item.product.category,
      productPrice: item.price,
      quantity: item.quantity
    }))
  });
};

/**
 * Track search
 * @param {string} searchTerm - Search term
 * @param {number} resultsCount - Number of results
 */
export const trackSearch = (searchTerm, resultsCount) => {
  return trackEvent(ANALYTICS_EVENTS.SEARCH, {
    searchTerm,
    resultsCount
  });
};

/**
 * Track exception
 * @param {string} description - Exception description
 * @param {boolean} fatal - Whether the exception was fatal
 */
export const trackException = (description, fatal = false) => {
  return trackEvent(ANALYTICS_EVENTS.EXCEPTION, {
    description,
    fatal
  });
};

/**
 * Get analytics data for admin dashboard
 * @param {string} timeRange - Time range (daily, weekly, monthly, yearly)
 * @returns {Promise} - Analytics data
 */
export const getAnalyticsData = async (timeRange = 'monthly') => {
  try {
    const response = await fetch(`${API_URL}/analytics/data?timeRange=${timeRange}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

/**
 * Get user behavior data
 * @param {Object} filters - Filters for the data
 * @returns {Promise} - User behavior data
 */
export const getUserBehaviorData = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    const response = await fetch(`${API_URL}/analytics/user-behavior?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user behavior data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user behavior data:', error);
    throw error;
  }
};

/**
 * Get sales analytics data
 * @param {Object} filters - Filters for the data
 * @returns {Promise} - Sales analytics data
 */
export const getSalesAnalyticsData = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    const response = await fetch(`${API_URL}/analytics/sales?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sales analytics data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sales analytics data:', error);
    throw error;
  }
};

/**
 * Export analytics data as CSV
 * @param {string} reportType - Type of report
 * @param {Object} filters - Filters for the data
 * @returns {Promise} - CSV data
 */
export const exportAnalyticsData = async (reportType, filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('reportType', reportType);
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    const response = await fetch(`${API_URL}/analytics/export?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to export analytics data');
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error exporting analytics data:', error);
    throw error;
  }
};
