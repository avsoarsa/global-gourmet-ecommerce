/**
 * Utility functions for personalization features
 */

// Local storage keys
const STORAGE_KEYS = {
  BROWSING_HISTORY: 'user_browsing_history',
  PRODUCT_VIEWS: 'product_view_count',
  CATEGORY_PREFERENCES: 'category_preferences',
  SEARCH_HISTORY: 'search_history',
  PERSONALIZATION_PROFILE: 'personalization_profile'
};

// Maximum items to store
const MAX_ITEMS = {
  BROWSING_HISTORY: 50,
  PRODUCT_VIEWS: 100,
  CATEGORY_PREFERENCES: 10,
  SEARCH_HISTORY: 20
};

/**
 * Track page view in browsing history
 * @param {string} path - Page path
 * @param {string} pageType - Page type (e.g., 'product', 'category', 'search')
 * @param {Object} metadata - Additional metadata
 */
export const trackPageView = (path, pageType, metadata = {}) => {
  try {
    // Get existing browsing history
    const history = getBrowsingHistory();
    
    // Create new entry
    const entry = {
      path,
      pageType,
      timestamp: new Date().toISOString(),
      ...metadata
    };
    
    // Add to history (at the beginning)
    history.unshift(entry);
    
    // Limit history size
    const limitedHistory = history.slice(0, MAX_ITEMS.BROWSING_HISTORY);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.BROWSING_HISTORY, JSON.stringify(limitedHistory));
    
    // Update category preferences if applicable
    if (pageType === 'category' && metadata.category) {
      updateCategoryPreference(metadata.category);
    }
    
    // Update product view count if applicable
    if (pageType === 'product' && metadata.productId) {
      incrementProductViewCount(metadata.productId);
    }
    
    // Update search history if applicable
    if (pageType === 'search' && metadata.searchTerm) {
      addToSearchHistory(metadata.searchTerm);
    }
    
    // Update personalization profile
    updatePersonalizationProfile();
    
    return true;
  } catch (error) {
    console.error('Error tracking page view:', error);
    return false;
  }
};

/**
 * Get browsing history
 * @returns {Array} - Browsing history
 */
export const getBrowsingHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.BROWSING_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting browsing history:', error);
    return [];
  }
};

/**
 * Get recent product views
 * @param {number} limit - Maximum number of items to return
 * @returns {Array} - Recent product views
 */
export const getRecentProductViews = (limit = 10) => {
  try {
    const history = getBrowsingHistory();
    return history
      .filter(entry => entry.pageType === 'product')
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent product views:', error);
    return [];
  }
};

/**
 * Get recent category views
 * @param {number} limit - Maximum number of items to return
 * @returns {Array} - Recent category views
 */
export const getRecentCategoryViews = (limit = 5) => {
  try {
    const history = getBrowsingHistory();
    return history
      .filter(entry => entry.pageType === 'category')
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent category views:', error);
    return [];
  }
};

/**
 * Increment product view count
 * @param {string|number} productId - Product ID
 */
export const incrementProductViewCount = (productId) => {
  try {
    // Get existing product view counts
    const viewCounts = getProductViewCounts();
    
    // Increment count for this product
    viewCounts[productId] = (viewCounts[productId] || 0) + 1;
    
    // Limit to top N products if we exceed the max
    if (Object.keys(viewCounts).length > MAX_ITEMS.PRODUCT_VIEWS) {
      const sortedEntries = Object.entries(viewCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, MAX_ITEMS.PRODUCT_VIEWS);
      
      const limitedViewCounts = {};
      sortedEntries.forEach(([id, count]) => {
        limitedViewCounts[id] = count;
      });
      
      // Save limited view counts
      localStorage.setItem(STORAGE_KEYS.PRODUCT_VIEWS, JSON.stringify(limitedViewCounts));
    } else {
      // Save all view counts
      localStorage.setItem(STORAGE_KEYS.PRODUCT_VIEWS, JSON.stringify(viewCounts));
    }
    
    return true;
  } catch (error) {
    console.error('Error incrementing product view count:', error);
    return false;
  }
};

/**
 * Get product view counts
 * @returns {Object} - Product view counts
 */
export const getProductViewCounts = () => {
  try {
    const viewCounts = localStorage.getItem(STORAGE_KEYS.PRODUCT_VIEWS);
    return viewCounts ? JSON.parse(viewCounts) : {};
  } catch (error) {
    console.error('Error getting product view counts:', error);
    return {};
  }
};

/**
 * Get most viewed products
 * @param {number} limit - Maximum number of items to return
 * @returns {Array} - Most viewed products
 */
export const getMostViewedProducts = (limit = 10) => {
  try {
    const viewCounts = getProductViewCounts();
    
    return Object.entries(viewCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, limit)
      .map(([productId, count]) => ({
        productId,
        viewCount: count
      }));
  } catch (error) {
    console.error('Error getting most viewed products:', error);
    return [];
  }
};

/**
 * Update category preference
 * @param {string} category - Category name
 */
export const updateCategoryPreference = (category) => {
  try {
    // Get existing category preferences
    const preferences = getCategoryPreferences();
    
    // Increment weight for this category
    preferences[category] = (preferences[category] || 0) + 1;
    
    // Limit to top N categories if we exceed the max
    if (Object.keys(preferences).length > MAX_ITEMS.CATEGORY_PREFERENCES) {
      const sortedEntries = Object.entries(preferences)
        .sort(([, weightA], [, weightB]) => weightB - weightA)
        .slice(0, MAX_ITEMS.CATEGORY_PREFERENCES);
      
      const limitedPreferences = {};
      sortedEntries.forEach(([category, weight]) => {
        limitedPreferences[category] = weight;
      });
      
      // Save limited preferences
      localStorage.setItem(STORAGE_KEYS.CATEGORY_PREFERENCES, JSON.stringify(limitedPreferences));
    } else {
      // Save all preferences
      localStorage.setItem(STORAGE_KEYS.CATEGORY_PREFERENCES, JSON.stringify(preferences));
    }
    
    return true;
  } catch (error) {
    console.error('Error updating category preference:', error);
    return false;
  }
};

/**
 * Get category preferences
 * @returns {Object} - Category preferences
 */
export const getCategoryPreferences = () => {
  try {
    const preferences = localStorage.getItem(STORAGE_KEYS.CATEGORY_PREFERENCES);
    return preferences ? JSON.parse(preferences) : {};
  } catch (error) {
    console.error('Error getting category preferences:', error);
    return {};
  }
};

/**
 * Get preferred categories
 * @param {number} limit - Maximum number of items to return
 * @returns {Array} - Preferred categories
 */
export const getPreferredCategories = (limit = 5) => {
  try {
    const preferences = getCategoryPreferences();
    
    return Object.entries(preferences)
      .sort(([, weightA], [, weightB]) => weightB - weightA)
      .slice(0, limit)
      .map(([category, weight]) => ({
        category,
        weight
      }));
  } catch (error) {
    console.error('Error getting preferred categories:', error);
    return [];
  }
};

/**
 * Add to search history
 * @param {string} searchTerm - Search term
 */
export const addToSearchHistory = (searchTerm) => {
  try {
    // Get existing search history
    const history = getSearchHistory();
    
    // Remove existing entry with the same search term (if any)
    const filteredHistory = history.filter(item => item.term !== searchTerm);
    
    // Add new entry at the beginning
    filteredHistory.unshift({
      term: searchTerm,
      timestamp: new Date().toISOString()
    });
    
    // Limit history size
    const limitedHistory = filteredHistory.slice(0, MAX_ITEMS.SEARCH_HISTORY);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(limitedHistory));
    
    return true;
  } catch (error) {
    console.error('Error adding to search history:', error);
    return false;
  }
};

/**
 * Get search history
 * @returns {Array} - Search history
 */
export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

/**
 * Update personalization profile
 */
export const updatePersonalizationProfile = () => {
  try {
    // Get data for profile
    const browsingHistory = getBrowsingHistory();
    const productViewCounts = getProductViewCounts();
    const categoryPreferences = getCategoryPreferences();
    const searchHistory = getSearchHistory();
    
    // Create profile
    const profile = {
      lastUpdated: new Date().toISOString(),
      stats: {
        totalPageViews: browsingHistory.length,
        productViews: browsingHistory.filter(entry => entry.pageType === 'product').length,
        categoryViews: browsingHistory.filter(entry => entry.pageType === 'category').length,
        searchCount: browsingHistory.filter(entry => entry.pageType === 'search').length
      },
      preferences: {
        topCategories: getPreferredCategories(3).map(item => item.category),
        topProducts: getMostViewedProducts(5).map(item => item.productId),
        recentSearches: searchHistory.slice(0, 3).map(item => item.term)
      }
    };
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.PERSONALIZATION_PROFILE, JSON.stringify(profile));
    
    return profile;
  } catch (error) {
    console.error('Error updating personalization profile:', error);
    return null;
  }
};

/**
 * Get personalization profile
 * @returns {Object} - Personalization profile
 */
export const getPersonalizationProfile = () => {
  try {
    const profile = localStorage.getItem(STORAGE_KEYS.PERSONALIZATION_PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting personalization profile:', error);
    return null;
  }
};

/**
 * Clear all personalization data
 */
export const clearPersonalizationData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.BROWSING_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.PRODUCT_VIEWS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORY_PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.PERSONALIZATION_PROFILE);
    return true;
  } catch (error) {
    console.error('Error clearing personalization data:', error);
    return false;
  }
};

export default {
  trackPageView,
  getBrowsingHistory,
  getRecentProductViews,
  getRecentCategoryViews,
  getProductViewCounts,
  getMostViewedProducts,
  getCategoryPreferences,
  getPreferredCategories,
  getSearchHistory,
  getPersonalizationProfile,
  clearPersonalizationData
};
