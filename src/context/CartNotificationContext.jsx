import { createContext, useState, useContext } from 'react';

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

  // Show notification
  const showNotification = (product, quantity = 1) => {
    setNotification({
      isVisible: true,
      product,
      quantity
    });
  };

  // Hide notification
  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  // Reset notification completely
  const resetNotification = () => {
    setNotification({
      isVisible: false,
      product: null,
      quantity: 0
    });
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
