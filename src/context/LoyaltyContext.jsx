import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

// Define loyalty tiers
export const LOYALTY_TIERS = [
  {
    id: 'bronze',
    name: 'Bronze',
    minPoints: 0,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    benefits: [
      'Earn 1 point per $1 spent',
      'Birthday reward',
      'Access to exclusive promotions'
    ]
  },
  {
    id: 'silver',
    name: 'Silver',
    minPoints: 500,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    benefits: [
      'Earn 1.5 points per $1 spent',
      'Free shipping on orders over $50',
      'Early access to new products',
      'All Bronze benefits'
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    minPoints: 1000,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    benefits: [
      'Earn 2 points per $1 spent',
      'Free shipping on all orders',
      'Exclusive seasonal gifts',
      'Priority customer service',
      'All Silver benefits'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum',
    minPoints: 2500,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    benefits: [
      'Earn 3 points per $1 spent',
      'Personal shopping assistant',
      'Exclusive access to limited editions',
      'Free gift wrapping',
      'All Gold benefits'
    ]
  }
];

// Define available rewards
export const AVAILABLE_REWARDS = [
  {
    id: 1,
    name: '10% Off Coupon',
    points: 200,
    type: 'discount',
    value: 10,
    description: 'Get 10% off your next purchase',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=320&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 2,
    name: 'Free Shipping',
    points: 300,
    type: 'shipping',
    value: 100,
    description: 'Free shipping on your next order',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=320&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 3,
    name: 'Premium Gift Box',
    points: 500,
    type: 'product',
    value: 'gift-box',
    description: 'Receive a premium gift box with your next order',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=320&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 4,
    name: '$25 Store Credit',
    points: 1000,
    type: 'credit',
    value: 25,
    description: 'Get $25 store credit to use on any purchase',
    image: 'https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?w=320&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];

// Create the loyalty context
const LoyaltyContext = createContext();

export const useLoyalty = () => useContext(LoyaltyContext);

export const LoyaltyProvider = ({ children }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const { addNewNotification } = useNotifications();
  const [loyaltyData, setLoyaltyData] = useState({
    points: 0,
    tier: LOYALTY_TIERS[0],
    history: [],
    rewards: []
  });
  const [loading, setLoading] = useState(true);

  // Initialize loyalty data from user profile
  useEffect(() => {
    if (currentUser) {
      const userLoyalty = currentUser.loyalty || {
        points: 0,
        tier: LOYALTY_TIERS[0].id,
        history: [],
        rewards: []
      };

      // Find the current tier object
      const currentTier = LOYALTY_TIERS.find(tier => tier.id === userLoyalty.tier) || LOYALTY_TIERS[0];

      setLoyaltyData({
        points: userLoyalty.points || 0,
        tier: currentTier,
        history: userLoyalty.history || [],
        rewards: userLoyalty.rewards || []
      });
    }
    setLoading(false);
  }, [currentUser]);

  // Calculate points multiplier based on tier
  const getPointsMultiplier = (tier) => {
    switch (tier.id) {
      case 'platinum':
        return 3;
      case 'gold':
        return 2;
      case 'silver':
        return 1.5;
      default:
        return 1;
    }
  };

  // Calculate points earned from a purchase
  const calculatePurchasePoints = (amount) => {
    if (!currentUser) return 0;

    // Base calculation: $1 = 1 point, rounded down
    const multiplier = getPointsMultiplier(loyaltyData.tier);
    return Math.floor(amount * multiplier);
  };

  // Add points to user's account
  const addPoints = async (points, source, details = {}) => {
    if (!currentUser || points <= 0) return false;

    try {
      // Create history entry
      const historyEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: 'earned',
        points,
        source,
        details
      };

      // Update points and history
      const newPoints = loyaltyData.points + points;
      const newHistory = [historyEntry, ...loyaltyData.history];

      // Check if user should be upgraded to a new tier
      let newTier = loyaltyData.tier;
      for (let i = LOYALTY_TIERS.length - 1; i >= 0; i--) {
        if (newPoints >= LOYALTY_TIERS[i].minPoints) {
          newTier = LOYALTY_TIERS[i];
          break;
        }
      }

      // If tier changed, add a history entry for tier upgrade
      if (newTier.id !== loyaltyData.tier.id) {
        const tierUpgradeEntry = {
          id: Date.now() + 1,
          date: new Date().toISOString(),
          type: 'tier_change',
          points: 0,
          source: 'tier_upgrade',
          details: {
            fromTier: loyaltyData.tier.name,
            toTier: newTier.name
          }
        };
        newHistory.unshift(tierUpgradeEntry);
      }

      // Update local state
      setLoyaltyData({
        ...loyaltyData,
        points: newPoints,
        tier: newTier,
        history: newHistory
      });

      // Update user profile
      if (updateUserProfile) {
        await updateUserProfile({
          loyalty: {
            points: newPoints,
            tier: newTier.id,
            history: newHistory,
            rewards: loyaltyData.rewards
          }
        });
      }

      // Show notification for points earned
      addNewNotification({
        title: 'Points Earned!',
        message: `You earned ${points} points from ${source}`,
        type: 'success'
      });

      // Show notification for tier upgrade if applicable
      if (newTier.id !== loyaltyData.tier.id) {
        addNewNotification({
          title: 'Tier Upgraded!',
          message: `Congratulations! You've been upgraded to ${newTier.name} tier`,
          type: 'success'
        });
      }

      return true;
    } catch (error) {
      console.error('Error adding points:', error);
      return false;
    }
  };

  // Deduct points from user's account (for redemptions)
  const deductPoints = async (points, reason, details = {}) => {
    if (!currentUser || points <= 0 || loyaltyData.points < points) return false;

    try {
      // Create history entry
      const historyEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: 'redeemed',
        points: -points,
        source: reason,
        details
      };

      // Update points and history
      const newPoints = loyaltyData.points - points;
      const newHistory = [historyEntry, ...loyaltyData.history];

      // Check if user should be downgraded to a lower tier
      let newTier = LOYALTY_TIERS[0]; // Default to lowest tier
      for (let i = LOYALTY_TIERS.length - 1; i >= 0; i--) {
        if (newPoints >= LOYALTY_TIERS[i].minPoints) {
          newTier = LOYALTY_TIERS[i];
          break;
        }
      }

      // If tier changed, add a history entry for tier downgrade
      if (newTier.id !== loyaltyData.tier.id) {
        const tierDowngradeEntry = {
          id: Date.now() + 1,
          date: new Date().toISOString(),
          type: 'tier_change',
          points: 0,
          source: 'tier_downgrade',
          details: {
            fromTier: loyaltyData.tier.name,
            toTier: newTier.name
          }
        };
        newHistory.unshift(tierDowngradeEntry);
      }

      // Update local state
      setLoyaltyData({
        ...loyaltyData,
        points: newPoints,
        tier: newTier,
        history: newHistory
      });

      // Update user profile
      if (updateUserProfile) {
        await updateUserProfile({
          loyalty: {
            points: newPoints,
            tier: newTier.id,
            history: newHistory,
            rewards: loyaltyData.rewards
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Error deducting points:', error);
      return false;
    }
  };

  // Redeem points for a reward
  const redeemReward = async (reward) => {
    if (!currentUser) return false;
    if (loyaltyData.points < reward.points) {
      addNewNotification({
        title: 'Insufficient Points',
        message: `You need ${reward.points - loyaltyData.points} more points to redeem this reward`,
        type: 'error'
      });
      return false;
    }

    try {
      // Create a new reward instance with unique ID and redemption date
      const redeemedReward = {
        ...reward,
        rewardId: reward.id,
        id: Date.now(),
        redeemedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days expiry
        used: false
      };

      // Add to user's rewards
      const newRewards = [...loyaltyData.rewards, redeemedReward];

      // Deduct points
      const deducted = await deductPoints(
        reward.points,
        'reward_redemption',
        { rewardId: reward.id, rewardName: reward.name }
      );

      if (!deducted) return false;

      // Update rewards in state
      setLoyaltyData({
        ...loyaltyData,
        rewards: newRewards
      });

      // Update user profile
      if (updateUserProfile) {
        await updateUserProfile({
          loyalty: {
            ...loyaltyData,
            rewards: newRewards
          }
        });
      }

      addNewNotification({
        title: 'Reward Redeemed!',
        message: `You've successfully redeemed ${reward.name}`,
        type: 'success'
      });

      return true;
    } catch (error) {
      console.error('Error redeeming reward:', error);
      return false;
    }
  };

  // Add points for purchase
  const addPointsForPurchase = async (orderTotal, orderId) => {
    const points = calculatePurchasePoints(orderTotal);
    return addPoints(points, 'purchase', { orderId, amount: orderTotal });
  };

  // Add points for review
  const addPointsForReview = async (productId, reviewId) => {
    // Fixed points for reviews
    const REVIEW_POINTS = 50;
    return addPoints(REVIEW_POINTS, 'review', { productId, reviewId });
  };

  // Add points for referral
  const addPointsForReferral = async (referredUserId) => {
    // Fixed points for referrals
    const REFERRAL_POINTS = 200;
    return addPoints(REFERRAL_POINTS, 'referral', { referredUserId });
  };

  // Get user's current tier
  const getCurrentTier = () => {
    return loyaltyData.tier;
  };

  // Get points needed for next tier
  const getPointsToNextTier = () => {
    const currentTierIndex = LOYALTY_TIERS.findIndex(tier => tier.id === loyaltyData.tier.id);
    if (currentTierIndex === LOYALTY_TIERS.length - 1) {
      // Already at highest tier
      return 0;
    }

    const nextTier = LOYALTY_TIERS[currentTierIndex + 1];
    return nextTier.minPoints - loyaltyData.points;
  };

  // Get next tier
  const getNextTier = () => {
    const currentTierIndex = LOYALTY_TIERS.findIndex(tier => tier.id === loyaltyData.tier.id);
    if (currentTierIndex === LOYALTY_TIERS.length - 1) {
      // Already at highest tier
      return null;
    }

    return LOYALTY_TIERS[currentTierIndex + 1];
  };

  // Check if a reward is available (user has enough points)
  const isRewardAvailable = (reward) => {
    return loyaltyData.points >= reward.points;
  };

  // Get user's available rewards (already redeemed)
  const getUserRewards = () => {
    return loyaltyData.rewards;
  };

  // Mark a reward as used
  const markRewardAsUsed = async (rewardId) => {
    if (!currentUser) return false;

    try {
      const rewardIndex = loyaltyData.rewards.findIndex(r => r.id === rewardId);
      if (rewardIndex === -1) return false;

      const newRewards = [...loyaltyData.rewards];
      newRewards[rewardIndex] = {
        ...newRewards[rewardIndex],
        used: true,
        usedAt: new Date().toISOString()
      };

      // Update rewards in state
      setLoyaltyData({
        ...loyaltyData,
        rewards: newRewards
      });

      // Update user profile
      if (updateUserProfile) {
        await updateUserProfile({
          loyalty: {
            ...loyaltyData,
            rewards: newRewards
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Error marking reward as used:', error);
      return false;
    }
  };

  // Context value
  const value = {
    points: loyaltyData.points,
    tier: loyaltyData.tier,
    history: loyaltyData.history,
    rewards: loyaltyData.rewards,
    addPoints,
    deductPoints,
    redeemReward,
    addPointsForPurchase,
    addPointsForReview,
    addPointsForReferral,
    getCurrentTier,
    getPointsToNextTier,
    getNextTier,
    isRewardAvailable,
    getUserRewards,
    markRewardAsUsed,
    calculatePurchasePoints,
    availableRewards: AVAILABLE_REWARDS,
    loyaltyTiers: LOYALTY_TIERS
  };

  return (
    <LoyaltyContext.Provider value={value}>
      {!loading && children}
    </LoyaltyContext.Provider>
  );
};

export default LoyaltyContext;
