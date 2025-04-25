/**
 * Analytics Service
 * Handles tracking user behavior and analytics data
 */

// Use relative URL for API endpoints in production
const API_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:5000/api';

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

    // Always log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', analyticsData);
    }

    // In production, we might not have a backend API yet
    // So we'll just log to console and return a success response
    if (process.env.NODE_ENV === 'production' && !window.ANALYTICS_API_ENABLED) {
      console.log('Analytics Event (production):', analyticsData);
      return { success: true, eventId: Date.now(), simulated: true };
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
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - Analytics data
 */
export const getAnalyticsData = async (timeRange = 'monthly') => {
  try {
    // Import dependencies here to avoid circular dependencies
    const { supabase } = await import('../utils/supabaseClient');
    const { checkAdminStatus } = await import('./adminService');

    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Set date range based on timeRange
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case 'daily':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7); // Last 7 days
        break;
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 28); // Last 4 weeks
        break;
      case 'yearly':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1); // Last year
        break;
      case 'monthly':
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3); // Last 3 months
        break;
    }

    // Format dates for Supabase
    const startDateStr = startDate.toISOString();
    const endDateStr = now.toISOString();

    // Get orders within date range
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at')
      .gte('created_at', startDateStr)
      .lte('created_at', endDateStr)
      .order('created_at', { ascending: true });

    if (ordersError) {
      throw ordersError;
    }

    // Get users within date range
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('user_id, created_at')
      .gte('created_at', startDateStr)
      .lte('created_at', endDateStr);

    if (usersError) {
      throw usersError;
    }

    // Get product views from analytics events
    const { data: productViews, error: viewsError } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('event_type', 'product_view')
      .gte('created_at', startDateStr)
      .lte('created_at', endDateStr);

    if (viewsError && viewsError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw viewsError;
    }

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const orderCount = orders.length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const newUserCount = users.length;
    const productViewCount = productViews?.length || 0;

    // Group data by time periods
    const salesByDay = groupByDay(orders, 'created_at', order => order.total_amount || 0);
    const usersByDay = groupByDay(users, 'created_at', () => 1);

    return {
      success: true,
      data: {
        totalRevenue,
        orderCount,
        completedOrders,
        newUserCount,
        productViewCount,
        conversionRate: orderCount > 0 && productViewCount > 0
          ? (orderCount / productViewCount * 100).toFixed(2)
          : 0,
        averageOrderValue: orderCount > 0
          ? (totalRevenue / orderCount).toFixed(2)
          : 0,
        salesByDay,
        usersByDay,
        timeRange
      }
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch analytics data'
    };
  }
};

/**
 * Helper function to group data by day
 * @param {Array} data - Data array
 * @param {string} dateField - Field containing date
 * @param {Function} valueFunc - Function to extract value
 * @returns {Array} - Grouped data
 */
const groupByDay = (data, dateField, valueFunc) => {
  const grouped = {};

  data.forEach(item => {
    const date = new Date(item[dateField]);
    const day = date.toISOString().split('T')[0]; // YYYY-MM-DD

    if (!grouped[day]) {
      grouped[day] = {
        date: day,
        value: 0
      };
    }

    grouped[day].value += valueFunc(item);
  });

  // Convert to array and sort by date
  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Get user behavior data
 * @param {Object} filters - Filters for the data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - User behavior data
 */
export const getUserBehaviorData = async (filters = {}) => {
  try {
    // Import dependencies here to avoid circular dependencies
    const { supabase } = await import('../utils/supabaseClient');
    const { checkAdminStatus } = await import('./adminService');

    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Set default date range if not provided
    const now = new Date();
    const startDate = filters.startDate
      ? new Date(filters.startDate)
      : new Date(now.setDate(now.getDate() - 30)); // Last 30 days
    const endDate = filters.endDate
      ? new Date(filters.endDate)
      : new Date();

    // Format dates for Supabase
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();

    // Get analytics events within date range
    let query = supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', startDateStr)
      .lte('created_at', endDateStr);

    // Apply event type filter if provided
    if (filters.eventType) {
      query = query.eq('event_type', filters.eventType);
    }

    // Apply user ID filter if provided
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    // Execute query
    const { data: events, error: eventsError } = await query;

    if (eventsError && eventsError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw eventsError;
    }

    // Group events by type
    const eventsByType = {};
    (events || []).forEach(event => {
      const type = event.event_type;
      if (!eventsByType[type]) {
        eventsByType[type] = [];
      }
      eventsByType[type].push(event);
    });

    // Calculate metrics
    const pageViews = eventsByType[ANALYTICS_EVENTS.PAGE_VIEW]?.length || 0;
    const productViews = eventsByType[ANALYTICS_EVENTS.PRODUCT_VIEW]?.length || 0;
    const addToCartEvents = eventsByType[ANALYTICS_EVENTS.ADD_TO_CART]?.length || 0;
    const checkoutEvents = eventsByType[ANALYTICS_EVENTS.BEGIN_CHECKOUT]?.length || 0;
    const purchaseEvents = eventsByType[ANALYTICS_EVENTS.PURCHASE]?.length || 0;

    // Calculate conversion rates
    const cartToCheckoutRate = addToCartEvents > 0
      ? (checkoutEvents / addToCartEvents * 100).toFixed(2)
      : 0;
    const checkoutToPurchaseRate = checkoutEvents > 0
      ? (purchaseEvents / checkoutEvents * 100).toFixed(2)
      : 0;
    const overallConversionRate = productViews > 0
      ? (purchaseEvents / productViews * 100).toFixed(2)
      : 0;

    // Get most viewed pages
    const pageViewEvents = eventsByType[ANALYTICS_EVENTS.PAGE_VIEW] || [];
    const pageViewCounts = {};
    pageViewEvents.forEach(event => {
      const pageName = event.event_data?.pageName || 'Unknown';
      pageViewCounts[pageName] = (pageViewCounts[pageName] || 0) + 1;
    });

    const mostViewedPages = Object.entries(pageViewCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get most viewed products
    const productViewEvents = eventsByType[ANALYTICS_EVENTS.PRODUCT_VIEW] || [];
    const productViewCounts = {};
    productViewEvents.forEach(event => {
      const productId = event.event_data?.productId;
      const productName = event.event_data?.productName || 'Unknown';
      if (productId) {
        const key = `${productId}:${productName}`;
        productViewCounts[key] = (productViewCounts[key] || 0) + 1;
      }
    });

    const mostViewedProducts = Object.entries(productViewCounts)
      .map(([key, count]) => {
        const [productId, productName] = key.split(':');
        return { productId, productName, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      success: true,
      data: {
        pageViews,
        productViews,
        addToCartEvents,
        checkoutEvents,
        purchaseEvents,
        cartToCheckoutRate,
        checkoutToPurchaseRate,
        overallConversionRate,
        mostViewedPages,
        mostViewedProducts,
        eventsByType,
        timeRange: {
          startDate: startDateStr,
          endDate: endDateStr
        }
      }
    };
  } catch (error) {
    console.error('Error fetching user behavior data:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch user behavior data'
    };
  }
};

/**
 * Get sales analytics data
 * @param {Object} filters - Filters for the data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - Sales analytics data
 */
export const getSalesAnalyticsData = async (filters = {}) => {
  try {
    // Import dependencies here to avoid circular dependencies
    const { supabase } = await import('../utils/supabaseClient');
    const { checkAdminStatus } = await import('./adminService');

    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    // Set default date range if not provided
    const now = new Date();
    const startDate = filters.startDate
      ? new Date(filters.startDate)
      : new Date(now.setDate(now.getDate() - 30)); // Last 30 days
    const endDate = filters.endDate
      ? new Date(filters.endDate)
      : new Date();

    // Format dates for Supabase
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();

    // Get orders within date range
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          variant_id,
          price,
          quantity,
          products (name, category_id)
        ),
        user_profiles (first_name, last_name)
      `)
      .gte('created_at', startDateStr)
      .lte('created_at', endDateStr);

    // Apply status filter if provided
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Execute query
    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      throw ordersError;
    }

    // Calculate sales metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const orderCount = orders.length;
    const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    // Group orders by status
    const ordersByStatus = {};
    orders.forEach(order => {
      const status = order.status || 'unknown';
      if (!ordersByStatus[status]) {
        ordersByStatus[status] = {
          count: 0,
          revenue: 0
        };
      }
      ordersByStatus[status].count += 1;
      ordersByStatus[status].revenue += order.total_amount || 0;
    });

    // Group sales by day
    const salesByDay = groupByDay(orders, 'created_at', order => order.total_amount || 0);

    // Calculate product sales
    const productSales = {};
    orders.forEach(order => {
      (order.order_items || []).forEach(item => {
        const productId = item.product_id;
        const productName = item.products?.name || 'Unknown Product';

        if (!productSales[productId]) {
          productSales[productId] = {
            id: productId,
            name: productName,
            quantity: 0,
            revenue: 0
          };
        }

        productSales[productId].quantity += item.quantity || 0;
        productSales[productId].revenue += (item.price || 0) * (item.quantity || 0);
      });
    });

    // Get top selling products
    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Calculate payment method distribution
    const paymentMethods = {};
    orders.forEach(order => {
      const method = order.payment_method || 'unknown';
      if (!paymentMethods[method]) {
        paymentMethods[method] = {
          count: 0,
          revenue: 0
        };
      }
      paymentMethods[method].count += 1;
      paymentMethods[method].revenue += order.total_amount || 0;
    });

    return {
      success: true,
      data: {
        totalRevenue,
        orderCount,
        averageOrderValue,
        ordersByStatus,
        salesByDay,
        topSellingProducts,
        paymentMethods,
        timeRange: {
          startDate: startDateStr,
          endDate: endDateStr
        }
      }
    };
  } catch (error) {
    console.error('Error fetching sales analytics data:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch sales analytics data'
    };
  }
};

/**
 * Export analytics data as CSV
 * @param {string} reportType - Type of report ('sales', 'users', 'products')
 * @param {Object} filters - Filters for the data
 * @returns {Promise<{success: boolean, data?: Blob, error?: string}>} - CSV data
 */
export const exportAnalyticsData = async (reportType, filters = {}) => {
  try {
    // Import dependencies here to avoid circular dependencies
    const { checkAdminStatus } = await import('./adminService');

    // Check admin status first
    const adminCheck = await checkAdminStatus();
    if (!adminCheck.success || !adminCheck.data.isAdmin) {
      return {
        success: false,
        error: 'Unauthorized access',
        status: 403
      };
    }

    let data;

    // Get data based on report type
    switch (reportType) {
      case 'sales':
        const salesResult = await getSalesAnalyticsData(filters);
        if (!salesResult.success) {
          throw new Error(salesResult.error);
        }
        data = salesResult.data;
        break;
      case 'users':
        const usersResult = await getUserBehaviorData(filters);
        if (!usersResult.success) {
          throw new Error(usersResult.error);
        }
        data = usersResult.data;
        break;
      case 'products':
        const { supabase } = await import('../utils/supabaseClient');

        // Get products with sales data
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            price,
            sale_price,
            stock_quantity,
            created_at,
            order_items (
              id,
              quantity,
              price
            )
          `);

        if (productsError) {
          throw productsError;
        }

        // Format product data
        data = {
          products: products.map(product => {
            const sales = product.order_items || [];
            const totalSold = sales.reduce((sum, item) => sum + (item.quantity || 0), 0);
            const totalRevenue = sales.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

            return {
              id: product.id,
              name: product.name,
              price: product.price,
              salePrice: product.sale_price,
              stockQuantity: product.stock_quantity,
              totalSold,
              totalRevenue,
              createdAt: product.created_at
            };
          })
        };
        break;
      default:
        throw new Error(`Invalid report type: ${reportType}`);
    }

    // Convert data to CSV
    const csvContent = convertToCSV(data, reportType);

    // Create blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    return {
      success: true,
      data: blob
    };
  } catch (error) {
    console.error('Error exporting analytics data:', error);
    return {
      success: false,
      error: error.message || 'Failed to export analytics data'
    };
  }
};

/**
 * Helper function to convert data to CSV
 * @param {Object} data - Data to convert
 * @param {string} reportType - Type of report
 * @returns {string} - CSV content
 */
const convertToCSV = (data, reportType) => {
  let csvRows = [];

  switch (reportType) {
    case 'sales':
      // Add header row
      csvRows.push(['Date', 'Revenue', 'Orders', 'Average Order Value'].join(','));

      // Add data rows
      (data.salesByDay || []).forEach(day => {
        csvRows.push([
          day.date,
          day.value.toFixed(2),
          day.orders || 0,
          day.averageOrderValue ? day.averageOrderValue.toFixed(2) : '0.00'
        ].join(','));
      });
      break;
    case 'users':
      // Add header row
      csvRows.push(['Page', 'Views'].join(','));

      // Add page view data
      (data.mostViewedPages || []).forEach(page => {
        csvRows.push([
          `"${page.page}"`, // Wrap in quotes to handle commas in page names
          page.count
        ].join(','));
      });

      // Add blank row
      csvRows.push('');

      // Add product view header
      csvRows.push(['Product', 'Views'].join(','));

      // Add product view data
      (data.mostViewedProducts || []).forEach(product => {
        csvRows.push([
          `"${product.productName}"`, // Wrap in quotes to handle commas in product names
          product.count
        ].join(','));
      });
      break;
    case 'products':
      // Add header row
      csvRows.push(['ID', 'Name', 'Price', 'Sale Price', 'Stock', 'Total Sold', 'Total Revenue', 'Created At'].join(','));

      // Add data rows
      (data.products || []).forEach(product => {
        csvRows.push([
          product.id,
          `"${product.name}"`, // Wrap in quotes to handle commas in product names
          product.price,
          product.salePrice || '',
          product.stockQuantity,
          product.totalSold,
          product.totalRevenue.toFixed(2),
          product.createdAt
        ].join(','));
      });
      break;
    default:
      csvRows.push('No data available');
  }

  return csvRows.join('\n');
};

export default {
  trackEvent,
  trackPageView,
  trackProductView,
  trackAddToCart,
  trackCheckout,
  trackPurchase,
  getAnalyticsData,
  getUserBehaviorData,
  getSalesAnalyticsData,
  exportAnalyticsData,
  getSalesAnalytics,
  getProductAnalytics,
  getUserAnalytics
};
