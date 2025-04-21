const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Helper function to read data files
const readDataFile = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write data files
const writeDataFile = (filename, data) => {
  const filePath = path.join(__dirname, 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Helper function to log admin activity
const logAdminActivity = (userId, action, details, ipAddress = '127.0.0.1') => {
  try {
    const data = readDataFile('adminActivity.json');
    const newActivity = {
      id: data.activities.length > 0 ? Math.max(...data.activities.map(a => a.id)) + 1 : 1,
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress
    };

    data.activities.push(newActivity);
    writeDataFile('adminActivity.json', data);

    return newActivity;
  } catch (error) {
    console.error('Error logging admin activity:', error);
    return null;
  }
};

// Middleware for validating admin requests
const validateAdmin = (req, res, next) => {
  // In a real app, this would validate the JWT token
  // For now, we'll just check if the user ID is provided in the request
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if the user is an admin
  try {
    const data = readDataFile('users.json');
    const user = data.users.find(u => u.id === parseInt(userId));

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Add user to request for later use
    req.user = user;
    next();
  } catch (error) {
    console.error('Error validating admin:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);

  // Check if the error has a status code
  const statusCode = err.statusCode || 500;

  // Send error response
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Routes

// Products
app.get('/api/products', (req, res) => {
  try {
    const data = readDataFile('products.json');
    res.json(data.products);
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const data = readDataFile('products.json');
    const product = data.products.find(p => p.id === parseInt(req.params.id));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error reading product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const data = readDataFile('products.json');
    const newProduct = {
      id: data.products.length > 0 ? Math.max(...data.products.map(p => p.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString()
    };

    data.products.push(newProduct);
    writeDataFile('products.json', data);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const data = readDataFile('products.json');
    const index = data.products.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    data.products[index] = {
      ...data.products[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    writeDataFile('products.json', data);

    res.json(data.products[index]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const data = readDataFile('products.json');
    const index = data.products.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = data.products[index];
    data.products.splice(index, 1);

    writeDataFile('products.json', data);

    res.json(deletedProduct);
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Categories
app.get('/api/categories', (req, res) => {
  try {
    const data = readDataFile('products.json');
    res.json(data.categories);
  } catch (error) {
    console.error('Error reading categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Gift Boxes
app.get('/api/gift-boxes', (req, res) => {
  try {
    const data = readDataFile('giftBoxes.json');
    res.json(data.giftBoxes);
  } catch (error) {
    console.error('Error reading gift boxes:', error);
    res.status(500).json({ error: 'Failed to fetch gift boxes' });
  }
});

app.get('/api/gift-boxes/:id', (req, res) => {
  try {
    const data = readDataFile('giftBoxes.json');
    const giftBox = data.giftBoxes.find(g => g.id === parseInt(req.params.id));

    if (!giftBox) {
      return res.status(404).json({ error: 'Gift box not found' });
    }

    res.json(giftBox);
  } catch (error) {
    console.error('Error reading gift box:', error);
    res.status(500).json({ error: 'Failed to fetch gift box' });
  }
});

// Reviews
app.get('/api/reviews', (req, res) => {
  try {
    const data = readDataFile('reviews.json');

    // Filter by product ID if provided
    if (req.query.productId) {
      const productId = parseInt(req.query.productId);
      const filteredReviews = data.reviews.filter(r => r.productId === productId);
      return res.json(filteredReviews);
    }

    res.json(data.reviews);
  } catch (error) {
    console.error('Error reading reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.post('/api/reviews', (req, res) => {
  try {
    const data = readDataFile('reviews.json');
    const newReview = {
      id: data.reviews.length > 0 ? Math.max(...data.reviews.map(r => r.id)) + 1 : 1,
      ...req.body,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      verified: true
    };

    data.reviews.push(newReview);
    writeDataFile('reviews.json', data);

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

app.post('/api/reviews/:id/helpful', (req, res) => {
  try {
    const data = readDataFile('reviews.json');
    const index = data.reviews.findIndex(r => r.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }

    data.reviews[index].helpfulCount += 1;
    writeDataFile('reviews.json', data);

    res.json(data.reviews[index]);
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(500).json({ error: 'Failed to mark review as helpful' });
  }
});

// Users & Authentication
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const data = readDataFile('users.json');

    const user = data.users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Don't send password to client
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token: 'mock-jwt-token' // In a real app, this would be a JWT
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// User profile
app.get('/api/users/:id', (req, res) => {
  try {
    const data = readDataFile('users.json');
    const user = data.users.find(u => u.id === parseInt(req.params.id));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't send password to client
    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Orders
app.get('/api/orders', (req, res) => {
  try {
    const data = readDataFile('users.json');
    const allOrders = [];

    // Collect orders from all users
    data.users.forEach(user => {
      if (user.orders) {
        user.orders.forEach(order => {
          allOrders.push({
            ...order,
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`
          });
        });
      }
    });

    // Filter by user ID if provided
    if (req.query.userId) {
      const userId = parseInt(req.query.userId);
      const filteredOrders = allOrders.filter(o => o.userId === userId);
      return res.json(filteredOrders);
    }

    res.json(allOrders);
  } catch (error) {
    console.error('Error reading orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin Settings
app.get('/api/admin/settings', validateAdmin, (req, res) => {
  try {
    const data = readDataFile('adminSettings.json');
    res.json(data.settings);
  } catch (error) {
    console.error('Error reading admin settings:', error);
    res.status(500).json({ error: 'Failed to fetch admin settings' });
  }
});

app.put('/api/admin/settings', validateAdmin, (req, res) => {
  try {
    const data = readDataFile('adminSettings.json');

    // Update settings
    data.settings = {
      ...data.settings,
      ...req.body
    };

    // Update last updated timestamp
    data.lastUpdated = new Date().toISOString();

    writeDataFile('adminSettings.json', data);

    // Log activity
    logAdminActivity(
      req.user.id,
      'update_settings',
      'Updated admin settings',
      req.ip
    );

    res.json(data.settings);
  } catch (error) {
    console.error('Error updating admin settings:', error);
    res.status(500).json({ error: 'Failed to update admin settings' });
  }
});

// Admin Activity
app.get('/api/admin/activity', validateAdmin, (req, res) => {
  try {
    const data = readDataFile('adminActivity.json');

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Sort by timestamp (newest first)
    const sortedActivities = [...data.activities].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    const paginatedActivities = sortedActivities.slice(startIndex, endIndex);

    res.json({
      activities: paginatedActivities,
      pagination: {
        total: data.activities.length,
        page,
        limit,
        pages: Math.ceil(data.activities.length / limit)
      }
    });
  } catch (error) {
    console.error('Error reading admin activity:', error);
    res.status(500).json({ error: 'Failed to fetch admin activity' });
  }
});

// Admin Dashboard Stats
app.get('/api/admin/stats', validateAdmin, (req, res) => {
  try {
    // Get products
    const productsData = readDataFile('products.json');
    const products = productsData.products;

    // Get users
    const usersData = readDataFile('users.json');
    const users = usersData.users.filter(u => u.role !== 'admin'); // Exclude admin users

    // Get orders
    const allOrders = [];
    usersData.users.forEach(user => {
      if (user.orders) {
        user.orders.forEach(order => {
          allOrders.push({
            ...order,
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`
          });
        });
      }
    });

    // Calculate stats
    const totalProducts = products.length;
    const totalUsers = users.length;
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate products by category
    const productsByCategory = {};
    products.forEach(product => {
      if (!productsByCategory[product.category]) {
        productsByCategory[product.category] = 0;
      }
      productsByCategory[product.category]++;
    });

    // Calculate recent orders (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = allOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= thirtyDaysAgo;
    });

    const recentRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      productsByCategory,
      recentOrders: recentOrders.slice(0, 5), // Return only the 5 most recent orders
      recentRevenue
    });
  } catch (error) {
    console.error('Error generating admin stats:', error);
    res.status(500).json({ error: 'Failed to generate admin stats' });
  }
});

// Apply error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
