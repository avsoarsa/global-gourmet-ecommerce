# Global Gourmet API Server

This is a mock API server for the Global Gourmet e-commerce platform. It provides basic CRUD operations for products, gift boxes, reviews, users, and orders.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Categories

- `GET /api/categories` - Get all categories

### Gift Boxes

- `GET /api/gift-boxes` - Get all gift boxes
- `GET /api/gift-boxes/:id` - Get a specific gift box

### Reviews

- `GET /api/reviews` - Get all reviews
- `GET /api/reviews?productId=1` - Get reviews for a specific product
- `POST /api/reviews` - Create a new review
- `POST /api/reviews/:id/helpful` - Mark a review as helpful

### Authentication

- `POST /api/auth/login` - Login with email and password

### Users

- `GET /api/users/:id` - Get a user's profile

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders?userId=1` - Get orders for a specific user

## Data Storage

All data is stored in JSON files in the `data` directory:

- `products.json` - Products and categories
- `giftBoxes.json` - Gift boxes
- `reviews.json` - Product reviews
- `users.json` - User accounts, including orders and wishlists

## Notes

This is a mock API server for development purposes. In a production environment, you would use a proper database and implement proper authentication and security measures.
