# Global Gourmet E-commerce Backend Setup

This document provides instructions for setting up the backend for the Global Gourmet E-commerce platform.

## Database Setup

### Step 1: Create Tables and Insert Data

1. Log in to your Supabase dashboard at https://lxljeehmdzrvxwaqlmhf.supabase.co
2. Navigate to the SQL Editor
3. Copy the contents of `sql/master_script.sql`
4. Paste it into the SQL Editor and click "Run"
5. Verify that all tables have been created and data has been inserted by checking the Table Editor

### Step 2: Set Up Authentication

1. In the Supabase dashboard, navigate to Authentication > Settings
2. Configure the following settings:
   - Site URL: Your production URL (e.g., https://your-app.vercel.app)
   - Redirect URLs: Add your local development URL (e.g., http://localhost:3000)
   - Enable Email/Password sign-in
   - Configure email templates for confirmation, invitation, and password reset

### Step 3: Set Up Storage

1. In the Supabase dashboard, navigate to Storage
2. Create the following buckets:
   - `product-images`: For storing product images
   - `review-images`: For storing review images
   - `user-avatars`: For storing user avatars
3. Set the bucket permissions to allow public read access but restrict write access to authenticated users

## Frontend Integration

### Step 1: Set Up Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following environment variables:
   ```
   VITE_SUPABASE_URL=https://lxljeehmdzrvxwaqlmhf.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### Step 2: Initialize Supabase Client

The Supabase client is already set up in `src/utils/supabaseClient.js`. Make sure it's properly configured to use the environment variables.

### Step 3: Use Backend Services

The following services have been implemented to interact with the Supabase backend:

- `productService.js`: Handles product-related operations
- `userService.js`: Handles user profile operations
- `wishlistService.js`: Handles wishlist operations
- `cartService.js`: Handles shopping cart operations
- `orderService.js`: Handles order operations
- `giftBoxService.js`: Handles gift box operations
- `subscriptionService.js`: Handles subscription operations

Import and use these services in your components to interact with the backend.

## Testing

### Step 1: Test Authentication

1. Test user registration
2. Test user login
3. Test password reset
4. Test profile update

### Step 2: Test Product Browsing

1. Test fetching all products
2. Test filtering products by category
3. Test searching products
4. Test fetching product details

### Step 3: Test Cart and Checkout

1. Test adding items to cart
2. Test updating cart items
3. Test removing items from cart
4. Test checkout process

### Step 4: Test User Profile

1. Test fetching user profile
2. Test updating user profile
3. Test adding/updating addresses
4. Test viewing order history

### Step 5: Test Wishlist

1. Test adding items to wishlist
2. Test removing items from wishlist
3. Test moving items from wishlist to cart

### Step 6: Test Gift Boxes

1. Test creating gift boxes
2. Test updating gift boxes
3. Test adding gift boxes to cart

### Step 7: Test Subscriptions

1. Test creating subscriptions
2. Test updating subscriptions
3. Test cancelling subscriptions

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Supabase project has the correct CORS configuration. In the Supabase dashboard, go to Settings > API and add your frontend URL to the allowed origins.

2. **Authentication Issues**: If you're having trouble with authentication, check that your site URL and redirect URLs are correctly configured in the Supabase dashboard.

3. **Database Errors**: If you encounter database errors, check the SQL logs in the Supabase dashboard to identify the issue.

4. **RLS Policy Issues**: If you're getting permission errors, check that your Row Level Security (RLS) policies are correctly configured.

### Getting Help

If you encounter any issues that you can't resolve, refer to the following resources:

- [Supabase Documentation](https://supabase.io/docs)
- [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)
- [Supabase Discord Community](https://discord.supabase.com)
