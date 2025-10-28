/**
 * Lightweight analytics helper used for the Next.js demo build.
 * Events are stored locally so charts and dashboards can render
 * without a backend or external telemetry service.
 */

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  PRODUCT_VIEW: 'product_view',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',
  SEARCH: 'search',
  EXCEPTION: 'exception',
  CUSTOM: 'custom_event'
};

const STORAGE_KEY = 'global_gourmet_analytics_events';
const MAX_EVENTS = 500;

const loadEvents = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse analytics events:', error);
    return [];
  }
};

const saveEvents = (events) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch (error) {
    console.error('Failed to persist analytics events:', error);
  }
};

let eventBuffer = loadEvents();

const recordEvent = (eventType, data = {}) => {
  const event = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    eventType,
    data,
    timestamp: new Date().toISOString()
  };

  eventBuffer = [...eventBuffer, event].slice(-MAX_EVENTS);
  saveEvents(eventBuffer);
  return event;
};

export const trackEvent = (eventType, eventData = {}) => {
  return recordEvent(eventType, eventData);
};

export const trackPageView = (pageName, data = {}) => {
  return recordEvent(ANALYTICS_EVENTS.PAGE_VIEW, { pageName, ...data });
};

export const trackProductView = (product) => {
  return recordEvent(ANALYTICS_EVENTS.PRODUCT_VIEW, {
    productId: product?.id,
    name: product?.name,
    category: product?.category
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  return recordEvent(ANALYTICS_EVENTS.ADD_TO_CART, {
    productId: product?.id,
    name: product?.name,
    quantity
  });
};

export const trackPurchase = (order) => {
  return recordEvent(ANALYTICS_EVENTS.PURCHASE, order);
};

export const trackSearch = (term, resultsCount) => {
  return recordEvent(ANALYTICS_EVENTS.SEARCH, { term, resultsCount });
};

export const trackException = (message, fatal = false) => {
  return recordEvent(ANALYTICS_EVENTS.EXCEPTION, { message, fatal });
};

export const getStoredEvents = () => {
  return [...eventBuffer];
};

export const retryFailedEvents = () => {
  // No-op in the static implementation, but retained for compatibility
  return eventBuffer.length;
};

export default {
  ANALYTICS_EVENTS,
  trackEvent,
  trackPageView,
  trackProductView,
  trackAddToCart,
  trackPurchase,
  trackSearch,
  trackException,
  getStoredEvents,
  retryFailedEvents
};
