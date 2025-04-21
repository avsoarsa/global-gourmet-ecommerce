import { useCartNotification } from '../../context/CartNotificationContext';
import CartNotification from './CartNotification';

/**
 * CartNotificationContainer - Container component that manages the cart notification
 * This component is placed at the root level to ensure notifications can be shown
 * from anywhere in the application
 */
const CartNotificationContainer = () => {
  const { notification, hideNotification, resetNotification } = useCartNotification();
  
  return (
    <CartNotification
      product={notification.product}
      quantity={notification.quantity}
      isVisible={notification.isVisible}
      onClose={() => {
        hideNotification();
        // Reset after animation completes
        setTimeout(resetNotification, 300);
      }}
    />
  );
};

export default CartNotificationContainer;
