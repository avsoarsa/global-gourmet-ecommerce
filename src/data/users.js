// In-memory users array (in a real app, this would be in a database)
let users = [
  {
    id: 0,
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be hashed
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    phone: "(555) 000-0000",
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      newsletterSubscription: false
    }
  },
  {
    id: 1,
    email: "user@example.com",
    password: "password123", // In a real app, this would be hashed
    firstName: "John",
    lastName: "Doe",
    phone: "(555) 123-4567",
    birthdate: "1985-06-15",
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      newsletterSubscription: true
    },
    loyalty: {
      points: 750,
      tier: 'silver',
      history: [
        {
          id: 1,
          date: "2023-11-15T10:30:00Z",
          type: "earned",
          points: 100,
          source: "purchase",
          details: { orderId: 1001, amount: 87.96 }
        },
        {
          id: 2,
          date: "2023-11-10T14:45:00Z",
          type: "earned",
          points: 50,
          source: "review",
          details: { productId: 1, reviewId: 1 }
        },
        {
          id: 3,
          date: "2023-10-25T09:15:00Z",
          type: "redeemed",
          points: -200,
          source: "reward_redemption",
          details: { rewardId: 1, rewardName: "10% Off Coupon" }
        },
        {
          id: 4,
          date: "2023-10-15T16:20:00Z",
          type: "earned",
          points: 300,
          source: "referral",
          details: { referredUserId: 2 }
        },
        {
          id: 5,
          date: "2023-10-01T08:00:00Z",
          type: "earned",
          points: 500,
          source: "welcome_bonus",
          details: { }
        }
      ],
      rewards: [
        {
          id: 101,
          rewardId: 1,
          name: "10% Off Coupon",
          points: 200,
          type: "discount",
          value: 10,
          description: "Get 10% off your next purchase",
          image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=320&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          redeemedAt: "2023-10-25T09:15:00Z",
          expiresAt: "2023-11-24T09:15:00Z",
          used: true,
          usedAt: "2023-10-26T14:30:00Z"
        }
      ]
    },
    addresses: [
      {
        id: 1,
        type: "Home",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
        isDefault: true
      },
      {
        id: 2,
        type: "Work",
        street: "456 Business Ave",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        country: "United States",
        isDefault: false
      }
    ],
    orders: [
      {
        id: 1001,
        date: "2023-04-15",
        status: "Delivered",
        total: 87.96,
        items: [
          { productId: 1, quantity: 2, price: 12.99 },
          { productId: 4, quantity: 1, price: 18.99 },
          { productId: 7, quantity: 1, price: 29.99 }
        ],
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States"
        }
      },
      {
        id: 1002,
        date: "2023-05-20",
        status: "Processing",
        total: 54.97,
        items: [
          { productId: 2, quantity: 1, price: 9.99 },
          { productId: 5, quantity: 3, price: 14.99 }
        ],
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States"
        }
      }
    ],
    wishlist: [3, 8, 12, 15]
  },
  {
    id: 2,
    email: "jane@example.com",
    password: "password456", // In a real app, this would be hashed
    firstName: "Jane",
    lastName: "Smith",
    phone: "(555) 987-6543",
    birthdate: "1990-03-22",
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      newsletterSubscription: false
    },
    addresses: [
      {
        id: 3,
        type: "Home",
        street: "789 Oak Dr",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        country: "United States",
        isDefault: true
      }
    ],
    orders: [
      {
        id: 1003,
        date: "2023-06-10",
        status: "Delivered",
        total: 69.97,
        items: [
          { productId: 10, quantity: 1, price: 14.99 },
          { productId: 12, quantity: 1, price: 24.99 },
          { productId: 6, quantity: 1, price: 8.99 },
          { productId: 9, quantity: 1, price: 9.99 }
        ],
        shippingAddress: {
          street: "789 Oak Dr",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90001",
          country: "United States"
        }
      }
    ],
    wishlist: [7, 11, 16]
  }
];

// Function to simulate authentication
export const authenticate = (email, password) => {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Function to update user data
export const updateUser = (userData) => {
  const index = users.findIndex(u => u.id === userData.id);
  if (index !== -1) {
    // Preserve the password field which is removed from the currentUser object
    const password = users[index].password;
    users[index] = { ...userData, password };
    return true;
  }
  return false;
};

// Function to get user by ID
export const getUserById = (id) => {
  const user = users.find(u => u.id === id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};
