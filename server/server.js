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

// Analytics Events
app.post('/api/analytics/events', (req, res) => {
  try {
    const data = readDataFile('analytics.json');
    const newEvent = {
      id: data.events.length > 0 ? Math.max(...data.events.map(e => e.id || 0)) + 1 : 1,
      ...req.body,
      serverTimestamp: new Date().toISOString()
    };

    data.events.push(newEvent);
    data.lastUpdated = new Date().toISOString();
    writeDataFile('analytics.json', data);

    res.status(201).json({ success: true, eventId: newEvent.id });
  } catch (error) {
    console.error('Error storing analytics event:', error);
    res.status(500).json({ error: 'Failed to store analytics event' });
  }
});

// Analytics Data
app.get('/api/analytics/data', validateAdmin, (req, res) => {
  try {
    const timeRange = req.query.timeRange || 'monthly';
    const data = readDataFile('analytics.json');

    // Get cutoff date based on time range
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeRange) {
      case 'daily':
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case 'weekly':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'yearly':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoffDate.setMonth(now.getMonth() - 1); // Default to monthly
    }

    // Filter events by date
    const filteredEvents = data.events.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= cutoffDate;
    });

    // Process events to generate analytics data
    const pageViews = filteredEvents.filter(e => e.eventType === 'page_view');
    const productViews = filteredEvents.filter(e => e.eventType === 'product_view');
    const addToCartEvents = filteredEvents.filter(e => e.eventType === 'add_to_cart');
    const purchaseEvents = filteredEvents.filter(e => e.eventType === 'purchase');

    // Calculate page view statistics
    const pageViewsByPage = {};
    pageViews.forEach(event => {
      const pageName = event.eventData?.pageName || 'unknown';
      pageViewsByPage[pageName] = (pageViewsByPage[pageName] || 0) + 1;
    });

    // Calculate product view statistics
    const productViewsByProduct = {};
    productViews.forEach(event => {
      const productId = event.eventData?.productId;
      if (productId) {
        productViewsByProduct[productId] = (productViewsByProduct[productId] || 0) + 1;
      }
    });

    // Calculate conversion rates
    const uniqueVisitors = new Set(pageViews.map(e => e.sessionId)).size;
    const uniquePurchasers = new Set(purchaseEvents.map(e => e.sessionId)).size;
    const conversionRate = uniqueVisitors > 0 ? (uniquePurchasers / uniqueVisitors) * 100 : 0;

    // Calculate cart abandonment rate
    const uniqueCartAdders = new Set(addToCartEvents.map(e => e.sessionId)).size;
    const cartAbandonmentRate = uniqueCartAdders > 0 ? ((uniqueCartAdders - uniquePurchasers) / uniqueCartAdders) * 100 : 0;

    // Calculate revenue
    const revenue = purchaseEvents.reduce((total, event) => {
      return total + (event.eventData?.revenue || 0);
    }, 0);

    // Calculate average order value
    const averageOrderValue = purchaseEvents.length > 0 ? revenue / purchaseEvents.length : 0;

    // Return analytics data
    res.json({
      timeRange,
      summary: {
        pageViews: pageViews.length,
        uniqueVisitors,
        productViews: productViews.length,
        addToCartEvents: addToCartEvents.length,
        purchases: purchaseEvents.length,
        revenue,
        averageOrderValue,
        conversionRate,
        cartAbandonmentRate
      },
      pageViewsByPage,
      productViewsByProduct,
      events: filteredEvents.slice(0, 100) // Return only the first 100 events for debugging
    });
  } catch (error) {
    console.error('Error generating analytics data:', error);
    res.status(500).json({ error: 'Failed to generate analytics data' });
  }
});

// User Behavior Analytics
app.get('/api/analytics/user-behavior', validateAdmin, (req, res) => {
  try {
    const data = readDataFile('analytics.json');

    // Get all sessions
    const sessions = {};
    data.events.forEach(event => {
      if (event.sessionId) {
        if (!sessions[event.sessionId]) {
          sessions[event.sessionId] = [];
        }
        sessions[event.sessionId].push(event);
      }
    });

    // Calculate session metrics
    const sessionMetrics = Object.entries(sessions).map(([sessionId, events]) => {
      // Sort events by timestamp
      events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const firstEvent = events[0];
      const lastEvent = events[events.length - 1];

      // Calculate session duration in seconds
      const startTime = new Date(firstEvent.timestamp);
      const endTime = new Date(lastEvent.timestamp);
      const durationSeconds = (endTime - startTime) / 1000;

      // Count page views in this session
      const pageViews = events.filter(e => e.eventType === 'page_view').length;

      // Check if user made a purchase
      const madePurchase = events.some(e => e.eventType === 'purchase');

      // Get user info
      const userId = firstEvent.userId;
      const isLoggedIn = firstEvent.isLoggedIn;
      const deviceType = firstEvent.deviceType;

      return {
        sessionId,
        userId,
        isLoggedIn,
        deviceType,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationSeconds,
        pageViews,
        totalEvents: events.length,
        madePurchase
      };
    });

    // Calculate user journey metrics
    const userJourneys = Object.entries(sessions).map(([sessionId, events]) => {
      // Sort events by timestamp
      events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // Extract journey steps
      const journey = events.map(event => ({
        eventType: event.eventType,
        timestamp: event.timestamp,
        pageName: event.eventData?.pageName,
        productId: event.eventData?.productId,
        productName: event.eventData?.productName
      }));

      return {
        sessionId,
        userId: events[0].userId,
        journey
      };
    });

    // Calculate funnel conversion rates
    const funnelSteps = [
      'page_view',
      'product_view',
      'add_to_cart',
      'begin_checkout',
      'purchase'
    ];

    const funnelAnalysis = funnelSteps.map((step, index) => {
      const sessionsReachingStep = Object.values(sessions).filter(events => {
        return events.some(e => e.eventType === step);
      }).length;

      const conversionRate = index > 0 ?
        (sessionsReachingStep / Object.keys(sessions).length) * 100 :
        100; // First step is always 100%

      const dropOffRate = index > 0 ?
        ((1 - (sessionsReachingStep / Object.values(sessions).filter(events => {
          return events.some(e => e.eventType === funnelSteps[index - 1]);
        }).length)) * 100) :
        0; // No drop-off for first step

      return {
        step,
        sessionsReachingStep,
        conversionRate,
        dropOffRate
      };
    });

    res.json({
      totalSessions: Object.keys(sessions).length,
      sessionMetrics: sessionMetrics.slice(0, 100), // Limit to 100 sessions
      userJourneys: userJourneys.slice(0, 20), // Limit to 20 journeys
      funnelAnalysis
    });
  } catch (error) {
    console.error('Error generating user behavior data:', error);
    res.status(500).json({ error: 'Failed to generate user behavior data' });
  }
});

// Sales Analytics
app.get('/api/analytics/sales', validateAdmin, (req, res) => {
  try {
    const data = readDataFile('analytics.json');
    const usersData = readDataFile('users.json');
    const productsData = readDataFile('products.json');

    // Get all purchase events
    const purchaseEvents = data.events.filter(e => e.eventType === 'purchase');

    // Get all orders from users data
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

    // Calculate sales by time period
    const salesByDay = {};
    const salesByMonth = {};
    const salesByCategory = {};

    allOrders.forEach(order => {
      const orderDate = new Date(order.date);
      const day = orderDate.toISOString().split('T')[0];
      const month = day.substring(0, 7); // YYYY-MM format

      // Sales by day
      salesByDay[day] = (salesByDay[day] || 0) + order.total;

      // Sales by month
      salesByMonth[month] = (salesByMonth[month] || 0) + order.total;

      // Sales by category
      order.items.forEach(item => {
        const product = productsData.products.find(p => p.id === item.product.id);
        if (product) {
          const category = product.category;
          salesByCategory[category] = (salesByCategory[category] || 0) + (item.price * item.quantity);
        }
      });
    });

    // Calculate top selling products
    const productSales = {};
    allOrders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product.id;
        if (!productSales[productId]) {
          productSales[productId] = {
            id: productId,
            name: item.product.name,
            category: item.product.category,
            unitsSold: 0,
            revenue: 0
          };
        }

        productSales[productId].unitsSold += item.quantity;
        productSales[productId].revenue += (item.price * item.quantity);
      });
    });

    // Convert to array and sort by revenue
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 products

    // Calculate sales growth
    const calculateGrowth = (current, previous) => {
      return previous > 0 ? ((current - previous) / previous) * 100 : 0;
    };

    // Get current and previous month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const previousMonthDate = new Date(now);
    previousMonthDate.setMonth(now.getMonth() - 1);
    const previousMonth = `${previousMonthDate.getFullYear()}-${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}`;

    const currentMonthSales = salesByMonth[currentMonth] || 0;
    const previousMonthSales = salesByMonth[previousMonth] || 0;
    const monthlyGrowth = calculateGrowth(currentMonthSales, previousMonthSales);

    // Return sales analytics data
    res.json({
      summary: {
        totalSales: allOrders.reduce((sum, order) => sum + order.total, 0),
        totalOrders: allOrders.length,
        averageOrderValue: allOrders.length > 0 ?
          allOrders.reduce((sum, order) => sum + order.total, 0) / allOrders.length : 0,
        monthlyGrowth
      },
      salesByDay,
      salesByMonth,
      salesByCategory,
      topProducts
    });
  } catch (error) {
    console.error('Error generating sales analytics data:', error);
    res.status(500).json({ error: 'Failed to generate sales analytics data' });
  }
});

// Export Analytics Data
app.get('/api/analytics/export', validateAdmin, (req, res) => {
  try {
    const reportType = req.query.reportType || 'sales';
    const data = readDataFile('analytics.json');
    const usersData = readDataFile('users.json');
    const productsData = readDataFile('products.json');

    let csvData = '';

    if (reportType === 'sales') {
      // Get all orders from users data
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

      // Create CSV header
      csvData = 'Order ID,Date,Customer,Total,Items,Status\n';

      // Add order data
      allOrders.forEach(order => {
        const itemsText = order.items.map(item =>
          `${item.quantity}x ${item.product.name}`
        ).join('; ');

        csvData += `${order.id},${order.date},${order.userName},${order.total},"${itemsText}",${order.status}\n`;
      });
    } else if (reportType === 'user-behavior') {
      // Get all sessions
      const sessions = {};
      data.events.forEach(event => {
        if (event.sessionId) {
          if (!sessions[event.sessionId]) {
            sessions[event.sessionId] = [];
          }
          sessions[event.sessionId].push(event);
        }
      });

      // Create CSV header
      csvData = 'Session ID,User ID,Device Type,Start Time,Duration (sec),Page Views,Total Events,Made Purchase\n';

      // Add session data
      Object.entries(sessions).forEach(([sessionId, events]) => {
        // Sort events by timestamp
        events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        const firstEvent = events[0];
        const lastEvent = events[events.length - 1];

        // Calculate session duration in seconds
        const startTime = new Date(firstEvent.timestamp);
        const endTime = new Date(lastEvent.timestamp);
        const durationSeconds = (endTime - startTime) / 1000;

        // Count page views in this session
        const pageViews = events.filter(e => e.eventType === 'page_view').length;

        // Check if user made a purchase
        const madePurchase = events.some(e => e.eventType === 'purchase');

        // Get user info
        const userId = firstEvent.userId || 'guest';
        const deviceType = firstEvent.deviceType || 'unknown';

        csvData += `${sessionId},${userId},${deviceType},${startTime.toISOString()},${durationSeconds},${pageViews},${events.length},${madePurchase}\n`;
      });
    }

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${reportType}-report.csv`);

    res.send(csvData);
  } catch (error) {
    console.error('Error exporting analytics data:', error);
    res.status(500).json({ error: 'Failed to export analytics data' });
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
