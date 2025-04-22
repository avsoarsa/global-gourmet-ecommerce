import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as analyticsService from '../services/analyticsService';

// Create context
const AnalyticsContext = createContext();

/**
 * Provider component for analytics tracking
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const AnalyticsProvider = ({ children }) => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);
  
  // Initialize analytics tracking
  useEffect(() => {
    if (!initialized) {
      // Retry sending any failed events
      analyticsService.retryFailedEvents();
      setInitialized(true);
    }
  }, [initialized]);
  
  // Track page views
  useEffect(() => {
    if (initialized) {
      // Extract page name from path
      const pageName = getPageNameFromPath(location.pathname);
      
      // Track page view
      analyticsService.trackPageView(pageName, {
        path: location.pathname,
        search: location.search,
        hash: location.hash
      });
    }
  }, [location, initialized]);
  
  // Helper function to get page name from path
  const getPageNameFromPath = (path) => {
    // Remove leading slash
    let cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Handle empty path (home page)
    if (!cleanPath) {
      return 'home';
    }
    
    // Handle dynamic paths
    if (cleanPath.startsWith('product/')) {
      return 'product_detail';
    }
    
    if (cleanPath.startsWith('category/')) {
      return 'category';
    }
    
    if (cleanPath.startsWith('admin/')) {
      return `admin_${cleanPath.substring(6) || 'dashboard'}`;
    }
    
    // Replace slashes with underscores
    return cleanPath.replace(/\//g, '_');
  };
  
  // Track exceptions
  useEffect(() => {
    const handleError = (event) => {
      const { message, filename, lineno, colno, error } = event;
      
      analyticsService.trackException(
        `${message} at ${filename}:${lineno}:${colno}`,
        true
      );
      
      // Don't prevent default error handling
      return false;
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  // Track performance metrics
  useEffect(() => {
    if (initialized && 'performance' in window && 'getEntriesByType' in window.performance) {
      // Wait for page to fully load
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfEntries = window.performance.getEntriesByType('navigation');
          
          if (perfEntries.length > 0) {
            const navigationEntry = perfEntries[0];
            
            // Track performance metrics
            analyticsService.trackEvent('performance', {
              pageLoadTime: navigationEntry.loadEventEnd - navigationEntry.startTime,
              domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime,
              firstPaint: navigationEntry.responseEnd - navigationEntry.startTime,
              ttfb: navigationEntry.responseStart - navigationEntry.startTime,
              redirectTime: navigationEntry.redirectEnd - navigationEntry.redirectStart,
              dnsLookupTime: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
              tcpConnectTime: navigationEntry.connectEnd - navigationEntry.connectStart,
              serverResponseTime: navigationEntry.responseEnd - navigationEntry.requestStart,
              downloadTime: navigationEntry.responseEnd - navigationEntry.responseStart,
              domInteractive: navigationEntry.domInteractive - navigationEntry.startTime
            });
          }
        }, 0);
      });
    }
  }, [initialized]);
  
  // Expose tracking functions
  const trackProductView = (product) => {
    return analyticsService.trackProductView(product);
  };
  
  const trackAddToCart = (product, quantity) => {
    return analyticsService.trackAddToCart(product, quantity);
  };
  
  const trackRemoveFromCart = (product, quantity) => {
    return analyticsService.trackEvent(analyticsService.ANALYTICS_EVENTS.REMOVE_FROM_CART, {
      productId: product.id,
      productName: product.name,
      quantity
    });
  };
  
  const trackCheckoutStep = (step, checkoutData) => {
    return analyticsService.trackCheckoutStep(step, checkoutData);
  };
  
  const trackPurchase = (order) => {
    return analyticsService.trackPurchase(order);
  };
  
  const trackSearch = (searchTerm, resultsCount) => {
    return analyticsService.trackSearch(searchTerm, resultsCount);
  };
  
  const trackEvent = (eventType, eventData) => {
    return analyticsService.trackEvent(eventType, eventData);
  };
  
  // Context value
  const value = {
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackCheckoutStep,
    trackPurchase,
    trackSearch,
    trackEvent
  };
  
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Custom hook for using the analytics context
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export default AnalyticsContext;
