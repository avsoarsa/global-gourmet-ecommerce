'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as analyticsService from '../services/analyticsService';

const AnalyticsContext = createContext(null);

export const AnalyticsProvider = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    analyticsService.retryFailedEvents();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    const pageName = derivePageName(pathname);
    analyticsService.trackPageView(pageName, {
      path: pathname,
      search: searchParams?.toString() || ''
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleError = (event) => {
      const { message, filename, lineno, colno } = event;
      analyticsService.trackException(
        `${message} at ${filename}:${lineno}:${colno}`,
        true
      );
      return false;
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const value = useMemo(() => ({
    trackProductView: analyticsService.trackProductView,
    trackAddToCart: analyticsService.trackAddToCart,
    trackPurchase: analyticsService.trackPurchase,
    trackSearch: analyticsService.trackSearch,
    trackEvent: analyticsService.trackEvent,
    trackException: analyticsService.trackException
  }), []);

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

const derivePageName = (path = '') => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (!cleanPath) return 'home';
  if (cleanPath.startsWith('product/')) return 'product_detail';
  if (cleanPath.startsWith('category/')) return 'category';
  if (cleanPath.startsWith('admin/')) return `admin_${cleanPath.substring(6) || 'dashboard'}`;
  return cleanPath.replace(/\//g, '_');
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export default AnalyticsContext;
