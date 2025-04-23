/**
 * CartNotificationService - A service to handle cart notifications
 * This service uses an event-based approach to decouple the cart and notification contexts
 */

// Event names
export const EVENTS = {
  SHOW_NOTIFICATION: 'cart:show-notification',
  HIDE_NOTIFICATION: 'cart:hide-notification',
  RESET_NOTIFICATION: 'cart:reset-notification'
};

// Event listeners
const listeners = {
  [EVENTS.SHOW_NOTIFICATION]: [],
  [EVENTS.HIDE_NOTIFICATION]: [],
  [EVENTS.RESET_NOTIFICATION]: []
};

/**
 * Subscribe to an event
 * @param {string} event - The event name
 * @param {Function} callback - The callback function
 * @returns {Function} - Unsubscribe function
 */
export const subscribe = (event, callback) => {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  
  listeners[event].push(callback);
  
  // Return unsubscribe function
  return () => {
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  };
};

/**
 * Publish an event
 * @param {string} event - The event name
 * @param {any} data - The event data
 */
export const publish = (event, data) => {
  if (listeners[event]) {
    listeners[event].forEach(callback => callback(data));
  }
};

/**
 * Show a cart notification
 * @param {Object} product - The product
 * @param {number} quantity - The quantity
 */
export const showNotification = (product, quantity = 1) => {
  publish(EVENTS.SHOW_NOTIFICATION, { product, quantity });
};

/**
 * Hide the cart notification
 */
export const hideNotification = () => {
  publish(EVENTS.HIDE_NOTIFICATION);
};

/**
 * Reset the cart notification
 */
export const resetNotification = () => {
  publish(EVENTS.RESET_NOTIFICATION);
};

// Export the service
const CartNotificationService = {
  subscribe,
  publish,
  showNotification,
  hideNotification,
  resetNotification,
  EVENTS
};

export default CartNotificationService;
