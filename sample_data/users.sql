-- This script creates a sample user in Supabase Auth and adds the corresponding user profile
-- Note: This is for testing purposes only. In production, users should sign up through the application.

-- First, create a user in Supabase Auth (this is done through the API in the application)
-- For testing, you can create a user manually in the Supabase dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Enter email: test@example.com and password: password123
-- 4. Click "Create User"

-- After creating the user in Supabase Auth, add the user profile in the database
-- Replace 'USER_ID_FROM_AUTH' with the actual user ID from Supabase Auth
INSERT INTO users (
  id, 
  email, 
  first_name, 
  last_name, 
  phone, 
  role, 
  is_verified, 
  marketing_consent, 
  created_at, 
  updated_at
)
VALUES (
  'USER_ID_FROM_AUTH', -- Replace with actual user ID from Supabase Auth
  'test@example.com',
  'Test',
  'User',
  '(555) 123-4567',
  'customer',
  true,
  true,
  NOW(),
  NOW()
);

-- Create user profile
INSERT INTO user_profiles (
  user_id,
  profile_picture,
  bio,
  preferences,
  notification_settings,
  created_at,
  updated_at
)
VALUES (
  'USER_ID_FROM_AUTH', -- Replace with actual user ID from Supabase Auth
  NULL,
  'I love dry fruits and spices!',
  '{"theme": "light", "language": "en"}'::jsonb,
  '{"email": true, "push": true, "sms": false}'::jsonb,
  NOW(),
  NOW()
);

-- Create a default address for the user
INSERT INTO addresses (
  user_id,
  address_type,
  is_default,
  first_name,
  last_name,
  address_line1,
  city,
  state,
  postal_code,
  country,
  phone,
  created_at,
  updated_at
)
VALUES (
  'USER_ID_FROM_AUTH', -- Replace with actual user ID from Supabase Auth
  'both',
  true,
  'Test',
  'User',
  '123 Main St',
  'New York',
  'NY',
  '10001',
  'United States',
  '(555) 123-4567',
  NOW(),
  NOW()
);
