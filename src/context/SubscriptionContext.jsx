import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { 
  getUserSubscriptions, 
  getSubscriptionById, 
  createSubscription, 
  updateSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  processSubscriptionRenewal,
  calculateSubscriptionPrice,
  SUBSCRIPTION_FREQUENCIES,
  SUBSCRIPTION_STATUS
} from '../data/subscriptions';
import { SUBSCRIPTION_ELIGIBLE_CATEGORIES } from '../data/products';

// Create subscription context
const SubscriptionContext = createContext();

// Custom hook to use the subscription context
export const useSubscription = () => useContext(SubscriptionContext);

// Subscription provider component
export const SubscriptionProvider = ({ children }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const { addNewNotification } = useNotifications();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user subscriptions when user changes
  useEffect(() => {
    if (currentUser) {
      loadUserSubscriptions();
    } else {
      setSubscriptions([]);
    }
    setLoading(false);
  }, [currentUser]);

  // Load user subscriptions
  const loadUserSubscriptions = () => {
    if (!currentUser) return;
    const userSubs = getUserSubscriptions(currentUser.id);
    setSubscriptions(userSubs);
  };

  // Check if a product is eligible for subscription
  const isProductSubscriptionEligible = (product) => {
    return SUBSCRIPTION_ELIGIBLE_CATEGORIES.includes(product.category);
  };

  // Subscribe to a product
  const subscribeToProduct = async (productData, subscriptionDetails) => {
    if (!currentUser) {
      addNewNotification({
        title: 'Authentication Required',
        message: 'Please log in to create a subscription',
        type: 'error'
      });
      return null;
    }

    try {
      // Calculate subscription price with discount
      const basePrice = productData.weightOptions.find(
        option => option.weight === subscriptionDetails.weight
      ).price;
      
      const subscriptionPrice = calculateSubscriptionPrice(
        basePrice, 
        subscriptionDetails.frequency
      );

      // Create subscription data
      const frequency = SUBSCRIPTION_FREQUENCIES.find(f => f.id === subscriptionDetails.frequency);
      const nextDeliveryDate = new Date();
      nextDeliveryDate.setDate(nextDeliveryDate.getDate() + frequency.days);

      const subscriptionData = {
        userId: currentUser.id,
        productId: productData.id,
        productName: productData.name,
        weight: subscriptionDetails.weight,
        quantity: subscriptionDetails.quantity || 1,
        frequency: subscriptionDetails.frequency,
        status: SUBSCRIPTION_STATUS.ACTIVE,
        nextDeliveryDate: nextDeliveryDate.toISOString(),
        price: subscriptionPrice,
        originalPrice: basePrice,
        discount: frequency.discount,
        paymentMethod: subscriptionDetails.paymentMethod,
        shippingAddress: subscriptionDetails.shippingAddress
      };

      // Create subscription
      const newSubscription = createSubscription(subscriptionData);
      
      // Update local state
      setSubscriptions([...subscriptions, newSubscription]);

      // Show notification
      addNewNotification({
        title: 'Subscription Created',
        message: `You've successfully subscribed to ${productData.name}`,
        type: 'success'
      });

      return newSubscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      
      addNewNotification({
        title: 'Subscription Error',
        message: 'Failed to create subscription. Please try again.',
        type: 'error'
      });
      
      return null;
    }
  };

  // Pause a subscription
  const pauseUserSubscription = async (subscriptionId) => {
    try {
      const updatedSubscription = pauseSubscription(subscriptionId);
      if (!updatedSubscription) return false;

      // Update local state
      setSubscriptions(subscriptions.map(sub => 
        sub.id === subscriptionId ? updatedSubscription : sub
      ));

      // Show notification
      addNewNotification({
        title: 'Subscription Paused',
        message: `Your subscription has been paused`,
        type: 'success'
      });

      return true;
    } catch (error) {
      console.error('Error pausing subscription:', error);
      
      addNewNotification({
        title: 'Subscription Error',
        message: 'Failed to pause subscription. Please try again.',
        type: 'error'
      });
      
      return false;
    }
  };

  // Resume a subscription
  const resumeUserSubscription = async (subscriptionId) => {
    try {
      const updatedSubscription = resumeSubscription(subscriptionId);
      if (!updatedSubscription) return false;

      // Update local state
      setSubscriptions(subscriptions.map(sub => 
        sub.id === subscriptionId ? updatedSubscription : sub
      ));

      // Show notification
      addNewNotification({
        title: 'Subscription Resumed',
        message: `Your subscription has been resumed`,
        type: 'success'
      });

      return true;
    } catch (error) {
      console.error('Error resuming subscription:', error);
      
      addNewNotification({
        title: 'Subscription Error',
        message: 'Failed to resume subscription. Please try again.',
        type: 'error'
      });
      
      return false;
    }
  };

  // Cancel a subscription
  const cancelUserSubscription = async (subscriptionId) => {
    try {
      const updatedSubscription = cancelSubscription(subscriptionId);
      if (!updatedSubscription) return false;

      // Update local state
      setSubscriptions(subscriptions.map(sub => 
        sub.id === subscriptionId ? updatedSubscription : sub
      ));

      // Show notification
      addNewNotification({
        title: 'Subscription Cancelled',
        message: `Your subscription has been cancelled`,
        type: 'success'
      });

      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      
      addNewNotification({
        title: 'Subscription Error',
        message: 'Failed to cancel subscription. Please try again.',
        type: 'error'
      });
      
      return false;
    }
  };

  // Update subscription details
  const updateUserSubscription = async (subscriptionId, updateData) => {
    try {
      const updatedSubscription = updateSubscription(subscriptionId, updateData);
      if (!updatedSubscription) return false;

      // Update local state
      setSubscriptions(subscriptions.map(sub => 
        sub.id === subscriptionId ? updatedSubscription : sub
      ));

      // Show notification
      addNewNotification({
        title: 'Subscription Updated',
        message: `Your subscription has been updated`,
        type: 'success'
      });

      return true;
    } catch (error) {
      console.error('Error updating subscription:', error);
      
      addNewNotification({
        title: 'Subscription Error',
        message: 'Failed to update subscription. Please try again.',
        type: 'error'
      });
      
      return false;
    }
  };

  // Process subscription renewal (simulate backend process)
  const processRenewal = async (subscriptionId) => {
    try {
      const updatedSubscription = processSubscriptionRenewal(subscriptionId);
      if (!updatedSubscription) return false;

      // Update local state
      setSubscriptions(subscriptions.map(sub => 
        sub.id === subscriptionId ? updatedSubscription : sub
      ));

      // Show notification
      addNewNotification({
        title: 'Subscription Renewed',
        message: `Your subscription has been renewed`,
        type: 'success'
      });

      return true;
    } catch (error) {
      console.error('Error processing renewal:', error);
      return false;
    }
  };

  // Get subscription frequencies
  const getSubscriptionFrequencies = () => {
    return SUBSCRIPTION_FREQUENCIES;
  };

  // Get subscription by ID
  const getSubscription = (subscriptionId) => {
    return subscriptions.find(sub => sub.id === subscriptionId);
  };

  // Get active subscriptions
  const getActiveSubscriptions = () => {
    return subscriptions.filter(sub => sub.status === SUBSCRIPTION_STATUS.ACTIVE);
  };

  // Context value
  const value = {
    subscriptions,
    loading,
    isProductSubscriptionEligible,
    subscribeToProduct,
    pauseUserSubscription,
    resumeUserSubscription,
    cancelUserSubscription,
    updateUserSubscription,
    processRenewal,
    getSubscriptionFrequencies,
    getSubscription,
    getActiveSubscriptions,
    SUBSCRIPTION_FREQUENCIES,
    SUBSCRIPTION_STATUS
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;
