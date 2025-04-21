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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
