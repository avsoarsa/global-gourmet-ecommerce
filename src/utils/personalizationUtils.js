/**
 * Utility functions for personalization features
 */

// Local storage keys
const STORAGE_KEYS = {
  BROWSING_HISTORY: 'user_browsing_history',
  PRODUCT_VIEWS: 'product_view_count',
  CATEGORY_PREFERENCES: 'category_preferences',
  SEARCH_HISTORY: 'search_history',
  PERSONALIZATION_PROFILE: 'personalization_profile',
  RECOMMENDATION_FEEDBACK: 'recommendation_feedback',
  PERSONALIZATION_METRICS: 'personalization_metrics',
  PERSONALIZATION_SETTINGS: 'personalization_settings'
};

// Maximum items to store
const MAX_ITEMS = {
  BROWSING_HISTORY: 50,
  PRODUCT_VIEWS: 100,
  CATEGORY_PREFERENCES: 10,
  SEARCH_HISTORY: 20,
  RECOMMENDATION_FEEDBACK: 200
};

// Default personalization settings
const DEFAULT_SETTINGS = {
  enabled: true,
  weightRecency: 0.7,  // How much to prioritize recent activity (0-1)
  weightFrequency: 0.5, // How much to prioritize frequent activity (0-1)
  weightFeedback: 0.8,  // How much to prioritize user feedback (0-1)
  decayRate: 0.95,      // How quickly older interactions lose value (0-1)
  minRelevanceScore: 0.3, // Minimum score for a recommendation to be shown
  refreshInterval: 24,  // Hours between algorithm refreshes
  maxSections: 3,       // Maximum number of personalized sections to show
  maxItemsPerSection: 8 // Maximum items per personalized section
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

/**
 * Record user feedback on a recommendation
 * @param {string} sectionId - ID of the recommendation section
 * @param {string|number} productId - Product ID
 * @param {boolean} isRelevant - Whether the recommendation was relevant
 */
export const recordRecommendationFeedback = (sectionId, productId, isRelevant) => {
  try {
    // Get existing feedback
    const feedback = getRecommendationFeedback();

    // Create feedback key
    const feedbackKey = `${sectionId}:${productId}`;

    // Record feedback
    feedback[feedbackKey] = {
      sectionId,
      productId,
      isRelevant,
      timestamp: new Date().toISOString()
    };

    // Limit feedback size
    if (Object.keys(feedback).length > MAX_ITEMS.RECOMMENDATION_FEEDBACK) {
      const sortedEntries = Object.entries(feedback)
        .sort(([, a], [, b]) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, MAX_ITEMS.RECOMMENDATION_FEEDBACK);

      const limitedFeedback = {};
      sortedEntries.forEach(([key, value]) => {
        limitedFeedback[key] = value;
      });

      // Save limited feedback
      localStorage.setItem(STORAGE_KEYS.RECOMMENDATION_FEEDBACK, JSON.stringify(limitedFeedback));
    } else {
      // Save all feedback
      localStorage.setItem(STORAGE_KEYS.RECOMMENDATION_FEEDBACK, JSON.stringify(feedback));
    }

    // Update metrics
    updatePersonalizationMetrics('feedback', { isRelevant });

    // Update personalization profile
    updatePersonalizationProfile();

    return true;
  } catch (error) {
    console.error('Error recording recommendation feedback:', error);
    return false;
  }
};

/**
 * Get recommendation feedback
 * @returns {Object} - Recommendation feedback
 */
export const getRecommendationFeedback = () => {
  try {
    const feedback = localStorage.getItem(STORAGE_KEYS.RECOMMENDATION_FEEDBACK);
    return feedback ? JSON.parse(feedback) : {};
  } catch (error) {
    console.error('Error getting recommendation feedback:', error);
    return {};
  }
};

/**
 * Get personalization settings
 * @returns {Object} - Personalization settings
 */
export const getPersonalizationSettings = () => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.PERSONALIZATION_SETTINGS);
    return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting personalization settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Update personalization settings
 * @param {Object} newSettings - New settings to apply
 */
export const updatePersonalizationSettings = (newSettings) => {
  try {
    const currentSettings = getPersonalizationSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.PERSONALIZATION_SETTINGS, JSON.stringify(updatedSettings));
    return true;
  } catch (error) {
    console.error('Error updating personalization settings:', error);
    return false;
  }
};

/**
 * Update personalization metrics
 * @param {string} metricType - Type of metric
 * @param {Object} data - Metric data
 */
export const updatePersonalizationMetrics = (metricType, data = {}) => {
  try {
    // Get existing metrics
    const metricsString = localStorage.getItem(STORAGE_KEYS.PERSONALIZATION_METRICS);
    const metrics = metricsString ? JSON.parse(metricsString) : {
      impressions: 0,
      clicks: 0,
      feedback: { positive: 0, negative: 0 },
      conversions: 0,
      lastUpdated: null
    };

    // Update metrics based on type
    switch (metricType) {
      case 'impression':
        metrics.impressions += 1;
        break;
      case 'click':
        metrics.clicks += 1;
        break;
      case 'feedback':
        if (data.isRelevant) {
          metrics.feedback.positive += 1;
        } else {
          metrics.feedback.negative += 1;
        }
        break;
      case 'conversion':
        metrics.conversions += 1;
        break;
      default:
        break;
    }

    // Update timestamp
    metrics.lastUpdated = new Date().toISOString();

    // Save metrics
    localStorage.setItem(STORAGE_KEYS.PERSONALIZATION_METRICS, JSON.stringify(metrics));

    return true;
  } catch (error) {
    console.error('Error updating personalization metrics:', error);
    return false;
  }
};

/**
 * Get personalization metrics
 * @returns {Object} - Personalization metrics
 */
export const getPersonalizationMetrics = () => {
  try {
    const metrics = localStorage.getItem(STORAGE_KEYS.PERSONALIZATION_METRICS);
    return metrics ? JSON.parse(metrics) : null;
  } catch (error) {
    console.error('Error getting personalization metrics:', error);
    return null;
  }
};

/**
 * Calculate relevance score for a product based on user behavior
 * @param {string|number} productId - Product ID
 * @returns {number} - Relevance score (0-1)
 */
export const calculateProductRelevance = (productId) => {
  try {
    const settings = getPersonalizationSettings();
    if (!settings.enabled) return 0;

    // Get data sources
    const viewCounts = getProductViewCounts();
    const browsingHistory = getBrowsingHistory();
    const feedback = getRecommendationFeedback();

    // Initialize score components
    let recencyScore = 0;
    let frequencyScore = 0;
    let feedbackScore = 0;

    // Calculate frequency score (0-1)
    const viewCount = viewCounts[productId] || 0;
    const maxViews = Math.max(...Object.values(viewCounts), 1);
    frequencyScore = viewCount / maxViews;

    // Calculate recency score (0-1)
    const productViews = browsingHistory
      .filter(entry => entry.pageType === 'product' && entry.metadata?.productId == productId);

    if (productViews.length > 0) {
      // Get most recent view
      const mostRecentView = productViews[0]; // Browsing history is sorted by recency
      const viewTime = new Date(mostRecentView.timestamp).getTime();
      const now = new Date().getTime();
      const hoursSinceView = (now - viewTime) / (1000 * 60 * 60);

      // Decay function: more recent = higher score
      recencyScore = Math.pow(settings.decayRate, hoursSinceView);
    }

    // Calculate feedback score (-1 to 1)
    // Check all feedback entries for this product
    const productFeedback = Object.values(feedback)
      .filter(item => item.productId == productId);

    if (productFeedback.length > 0) {
      // Calculate weighted average of feedback (more recent feedback has more weight)
      let totalWeight = 0;
      let weightedSum = 0;

      productFeedback.forEach(item => {
        const feedbackTime = new Date(item.timestamp).getTime();
        const now = new Date().getTime();
        const daysSinceFeedback = (now - feedbackTime) / (1000 * 60 * 60 * 24);

        // Decay weight based on recency
        const weight = Math.pow(settings.decayRate, daysSinceFeedback);

        // Add to weighted sum (positive = 1, negative = -1)
        weightedSum += weight * (item.isRelevant ? 1 : -1);
        totalWeight += weight;
      });

      // Normalize to -1 to 1 range
      feedbackScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

      // Convert to 0-1 range
      feedbackScore = (feedbackScore + 1) / 2;
    } else {
      // No feedback, use neutral score
      feedbackScore = 0.5;
    }

    // Combine scores using weights from settings
    const combinedScore =
      (settings.weightRecency * recencyScore) +
      (settings.weightFrequency * frequencyScore) +
      (settings.weightFeedback * feedbackScore);

    // Normalize to 0-1 range
    const maxPossibleScore =
      settings.weightRecency +
      settings.weightFrequency +
      settings.weightFeedback;

    const normalizedScore = combinedScore / maxPossibleScore;

    return normalizedScore;
  } catch (error) {
    console.error('Error calculating product relevance:', error);
    return 0;
  }
};

/**
 * Get personalized product recommendations
 * @param {Array} products - All available products
 * @param {number} limit - Maximum number of recommendations
 * @param {Array} excludeIds - Product IDs to exclude
 * @returns {Array} - Recommended products with relevance scores
 */
export const getPersonalizedRecommendations = (products, limit = 8, excludeIds = []) => {
  try {
    const settings = getPersonalizationSettings();
    if (!settings.enabled) {
      // Return random products if personalization is disabled
      return [...products]
        .filter(p => !excludeIds.includes(p.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, limit)
        .map(product => ({
          ...product,
          relevanceScore: 0,
          isPersonalized: false
        }));
    }

    // Calculate relevance scores for all products
    const productsWithScores = products
      .filter(p => !excludeIds.includes(p.id))
      .map(product => ({
        ...product,
        relevanceScore: calculateProductRelevance(product.id),
        isPersonalized: true
      }))
      .filter(p => p.relevanceScore >= settings.minRelevanceScore);

    // Sort by relevance score (highest first)
    const sortedProducts = [...productsWithScores]
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // If we don't have enough relevant products, add some random ones
    if (sortedProducts.length < limit) {
      const existingIds = sortedProducts.map(p => p.id);
      const additionalProducts = products
        .filter(p => !excludeIds.includes(p.id) && !existingIds.includes(p.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, limit - sortedProducts.length)
        .map(product => ({
          ...product,
          relevanceScore: 0,
          isPersonalized: false
        }));

      return [...sortedProducts, ...additionalProducts];
    }

    return sortedProducts.slice(0, limit);
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);

    // Fallback to random products
    return [...products]
      .filter(p => !excludeIds.includes(p.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, limit)
      .map(product => ({
        ...product,
        relevanceScore: 0,
        isPersonalized: false
      }));
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
  clearPersonalizationData,
  recordRecommendationFeedback,
  getRecommendationFeedback,
  getPersonalizationSettings,
  updatePersonalizationSettings,
  updatePersonalizationMetrics,
  getPersonalizationMetrics,
  calculateProductRelevance,
  getPersonalizedRecommendations
};
