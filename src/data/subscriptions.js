// Subscription frequency options
export const SUBSCRIPTION_FREQUENCIES = [
  {
    id: 'weekly',
    name: 'Weekly',
    days: 7,
    discount: 15, // 15% discount for weekly subscriptions
    description: 'Delivered every week'
  },
  {
    id: 'biweekly',
    name: 'Bi-Weekly',
    days: 14,
    discount: 12, // 12% discount for bi-weekly subscriptions
    description: 'Delivered every two weeks'
  },
  {
    id: 'monthly',
    name: 'Monthly',
    days: 30,
    discount: 10, // 10% discount for monthly subscriptions
    description: 'Delivered every month'
  },
  {
    id: 'bimonthly',
    name: 'Bi-Monthly',
    days: 60,
    discount: 8, // 8% discount for bi-monthly subscriptions
    description: 'Delivered every two months'
  }
];

// Subscription status options
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
  PENDING: 'pending'
};

// Sample user subscriptions
export const userSubscriptions = [
  {
    id: 'sub_001',
    userId: 1,
    productId: 1,
    productName: 'Premium Medjool Dates',
    weight: '500g',
    quantity: 1,
    frequency: 'monthly',
    status: 'active',
    nextDeliveryDate: '2023-08-15',
    createdAt: '2023-07-15',
    price: 11.69, // Discounted price (10% off 12.99)
    originalPrice: 12.99,
    discount: 10,
    paymentMethod: {
      id: 'pm_001',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025
    },
    shippingAddress: {
      id: 'addr_001',
      name: 'John Doe',
      line1: '123 Main St',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States'
    },
    orderHistory: [
      {
        id: 'order_001',
        date: '2023-07-15',
        status: 'delivered',
        trackingNumber: 'TRK123456789'
      }
    ]
  },
  {
    id: 'sub_002',
    userId: 1,
    productId: 5,
    productName: 'Raw Cashews',
    weight: '1kg',
    quantity: 1,
    frequency: 'biweekly',
    status: 'active',
    nextDeliveryDate: '2023-08-10',
    createdAt: '2023-07-27',
    price: 25.07, // Discounted price (12% off 28.49)
    originalPrice: 28.49,
    discount: 12,
    paymentMethod: {
      id: 'pm_001',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025
    },
    shippingAddress: {
      id: 'addr_001',
      name: 'John Doe',
      line1: '123 Main St',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States'
    },
    orderHistory: [
      {
        id: 'order_002',
        date: '2023-07-27',
        status: 'delivered',
        trackingNumber: 'TRK987654321'
      }
    ]
  },
  {
    id: 'sub_003',
    userId: 2,
    productId: 9,
    productName: 'Organic Turmeric Powder',
    weight: '250g',
    quantity: 2,
    frequency: 'monthly',
    status: 'paused',
    nextDeliveryDate: null,
    pausedAt: '2023-08-01',
    createdAt: '2023-06-20',
    price: 21.59, // Discounted price (10% off 23.99)
    originalPrice: 23.99,
    discount: 10,
    paymentMethod: {
      id: 'pm_002',
      last4: '1234',
      brand: 'Mastercard',
      expiryMonth: 10,
      expiryYear: 2024
    },
    shippingAddress: {
      id: 'addr_002',
      name: 'Jane Smith',
      line1: '456 Oak Ave',
      line2: '',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States'
    },
    orderHistory: [
      {
        id: 'order_003',
        date: '2023-06-20',
        status: 'delivered',
        trackingNumber: 'TRK111222333'
      },
      {
        id: 'order_004',
        date: '2023-07-20',
        status: 'delivered',
        trackingNumber: 'TRK444555666'
      }
    ]
  }
];

// Subscription management functions
export const getUserSubscriptions = (userId) => {
  return userSubscriptions.filter(sub => sub.userId === userId);
};

export const getSubscriptionById = (subscriptionId) => {
  return userSubscriptions.find(sub => sub.id === subscriptionId);
};

export const createSubscription = (subscriptionData) => {
  const newSubscription = {
    id: `sub_${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    status: SUBSCRIPTION_STATUS.ACTIVE,
    orderHistory: [],
    ...subscriptionData
  };
  
  userSubscriptions.push(newSubscription);
  return newSubscription;
};

export const updateSubscription = (subscriptionId, updateData) => {
  const index = userSubscriptions.findIndex(sub => sub.id === subscriptionId);
  if (index === -1) return null;
  
  userSubscriptions[index] = {
    ...userSubscriptions[index],
    ...updateData
  };
  
  return userSubscriptions[index];
};

export const pauseSubscription = (subscriptionId) => {
  const subscription = getSubscriptionById(subscriptionId);
  if (!subscription) return null;
  
  return updateSubscription(subscriptionId, {
    status: SUBSCRIPTION_STATUS.PAUSED,
    pausedAt: new Date().toISOString(),
    nextDeliveryDate: null
  });
};

export const resumeSubscription = (subscriptionId) => {
  const subscription = getSubscriptionById(subscriptionId);
  if (!subscription) return null;
  
  // Calculate next delivery date based on frequency
  const frequency = SUBSCRIPTION_FREQUENCIES.find(f => f.id === subscription.frequency);
  const nextDeliveryDate = new Date();
  nextDeliveryDate.setDate(nextDeliveryDate.getDate() + frequency.days);
  
  return updateSubscription(subscriptionId, {
    status: SUBSCRIPTION_STATUS.ACTIVE,
    pausedAt: null,
    nextDeliveryDate: nextDeliveryDate.toISOString()
  });
};

export const cancelSubscription = (subscriptionId) => {
  const subscription = getSubscriptionById(subscriptionId);
  if (!subscription) return null;
  
  return updateSubscription(subscriptionId, {
    status: SUBSCRIPTION_STATUS.CANCELLED,
    cancelledAt: new Date().toISOString(),
    nextDeliveryDate: null
  });
};

export const processSubscriptionRenewal = (subscriptionId) => {
  const subscription = getSubscriptionById(subscriptionId);
  if (!subscription || subscription.status !== SUBSCRIPTION_STATUS.ACTIVE) return null;
  
  // Create a new order for this subscription
  const newOrder = {
    id: `order_${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
    date: new Date().toISOString(),
    status: 'processing',
    trackingNumber: null
  };
  
  // Calculate next delivery date based on frequency
  const frequency = SUBSCRIPTION_FREQUENCIES.find(f => f.id === subscription.frequency);
  const nextDeliveryDate = new Date();
  nextDeliveryDate.setDate(nextDeliveryDate.getDate() + frequency.days);
  
  // Update subscription with new order and next delivery date
  return updateSubscription(subscriptionId, {
    orderHistory: [...subscription.orderHistory, newOrder],
    nextDeliveryDate: nextDeliveryDate.toISOString()
  });
};

// Function to calculate subscription price with discount
export const calculateSubscriptionPrice = (basePrice, frequencyId) => {
  const frequency = SUBSCRIPTION_FREQUENCIES.find(f => f.id === frequencyId);
  if (!frequency) return basePrice;
  
  const discountAmount = basePrice * (frequency.discount / 100);
  return parseFloat((basePrice - discountAmount).toFixed(2));
};
