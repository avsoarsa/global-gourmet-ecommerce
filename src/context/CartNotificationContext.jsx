import { createContext, useState, useContext, useEffect } from 'react';
import CartNotificationService, { EVENTS } from '../services/CartNotificationService';

// Create context
const CartNotificationContext = createContext();

// Custom hook to use the cart notification context
export const useCartNotification = () => useContext(CartNotificationContext);

// Provider component
export const CartNotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    isVisible: false,
    product: null,
    quantity: 0
  });

  // Subscribe to cart notification events
  useEffect(() => {
    // Handle show notification event
    const showUnsubscribe = CartNotificationService.subscribe(
      EVENTS.SHOW_NOTIFICATION,
      ({ product, quantity }) => {
        setNotification({
          isVisible: true,
          product,
          quantity
        });
      }
    );

    // Handle hide notification event
    const hideUnsubscribe = CartNotificationService.subscribe(
      EVENTS.HIDE_NOTIFICATION,
      () => {
        setNotification(prev => ({
          ...prev,
          isVisible: false
        }));
      }
    );

    // Handle reset notification event
    const resetUnsubscribe = CartNotificationService.subscribe(
      EVENTS.RESET_NOTIFICATION,
      () => {
        setNotification({
          isVisible: false,
          product: null,
          quantity: 0
        });
      }
    );

    // Cleanup subscriptions on unmount
    return () => {
      showUnsubscribe();
      hideUnsubscribe();
      resetUnsubscribe();
    };
  }, []);

  // Show notification
  const showNotification = (product, quantity = 1) => {
    CartNotificationService.showNotification(product, quantity);
  };

  // Hide notification
  const hideNotification = () => {
    CartNotificationService.hideNotification();
  };

  // Reset notification completely
  const resetNotification = () => {
    CartNotificationService.resetNotification();
  };

  // Context value
  const value = {
    notification,
    showNotification,
    hideNotification,
    resetNotification
  };

  return (
    <CartNotificationContext.Provider value={value}>
      {children}
    </CartNotificationContext.Provider>
  );
};

export default CartNotificationContext;
