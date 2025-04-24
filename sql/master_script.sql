-- Master SQL script for Global Gourmet E-commerce
-- This script creates all tables and inserts essential data

-- =============================================
-- PART 0: CHECK AND FIX EXISTING TABLES
-- =============================================

-- Enable the uuid-ossp extension if it's not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if auth schema exists and create it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth') THEN
    CREATE SCHEMA IF NOT EXISTS auth;

    -- Create a minimal auth.users table if it doesn't exist
    CREATE TABLE IF NOT EXISTS auth.users (
      id UUID PRIMARY KEY,
      email TEXT UNIQUE,
      role TEXT DEFAULT 'user'
    );
  END IF;

  -- Create auth.uid() function if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'auth' AND p.proname = 'uid'
  ) THEN
    EXECUTE '
    CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $func$
    BEGIN
      -- This is a placeholder function that returns NULL
      -- In a real Supabase environment, this would return the authenticated user''s ID
      RETURN NULL::UUID;
    END;
    $func$ LANGUAGE plpgsql;
    ';
  END IF;
END $$;

-- Make sure product_categories table exists before adding foreign key references
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_categories') THEN
    CREATE TABLE product_categories (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      parent_id UUID REFERENCES product_categories(id),
      image TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      display_order INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- Make sure products table exists before adding columns to it
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') THEN
    CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      short_description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      compare_at_price DECIMAL(10, 2),
      discount_percentage DECIMAL(5, 2) DEFAULT 0,
      hs_code TEXT,
      origin TEXT,
      nutritional_info JSONB,
      stock_quantity INTEGER DEFAULT 0,
      is_featured BOOLEAN DEFAULT FALSE,
      is_bestseller BOOLEAN DEFAULT FALSE,
      is_organic BOOLEAN DEFAULT FALSE,
      rating DECIMAL(3, 2) DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      category_id UUID REFERENCES product_categories(id),
      sku TEXT, -- Added sku column
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- Add missing columns to products table if it already exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') THEN
    -- Check for discount_percentage column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'discount_percentage'
    ) THEN
      ALTER TABLE products ADD COLUMN discount_percentage DECIMAL(5, 2) DEFAULT 0;
    END IF;

    -- Check for origin column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'origin'
    ) THEN
      ALTER TABLE products ADD COLUMN origin TEXT;
    END IF;

    -- Check for hs_code column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'hs_code'
    ) THEN
      ALTER TABLE products ADD COLUMN hs_code TEXT;
    END IF;

    -- Check for nutritional_info column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'nutritional_info'
    ) THEN
      ALTER TABLE products ADD COLUMN nutritional_info JSONB;
    END IF;

    -- Check for short_description column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'short_description'
    ) THEN
      ALTER TABLE products ADD COLUMN short_description TEXT;
    END IF;

    -- Check for is_featured column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'is_featured'
    ) THEN
      ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;

    -- Check for is_bestseller column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'is_bestseller'
    ) THEN
      ALTER TABLE products ADD COLUMN is_bestseller BOOLEAN DEFAULT FALSE;
    END IF;

    -- Check for is_organic column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'is_organic'
    ) THEN
      ALTER TABLE products ADD COLUMN is_organic BOOLEAN DEFAULT FALSE;
    END IF;

    -- Check for rating column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'rating'
    ) THEN
      ALTER TABLE products ADD COLUMN rating DECIMAL(3, 2) DEFAULT 0;
    END IF;

    -- Check for review_count column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'review_count'
    ) THEN
      ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0;
    END IF;

    -- Check for category_id column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'category_id'
    ) THEN
      ALTER TABLE products ADD COLUMN category_id UUID REFERENCES product_categories(id);
    END IF;

    -- Check for compare_at_price column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'compare_at_price'
    ) THEN
      ALTER TABLE products ADD COLUMN compare_at_price DECIMAL(10, 2);
    END IF;

    -- Check for stock_quantity column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'stock_quantity'
    ) THEN
      ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
    END IF;

    -- Check for sku column
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'sku'
    ) THEN
      ALTER TABLE products ADD COLUMN sku TEXT;
    END IF;

    -- If sku column has NOT NULL constraint but we can't add values, make it nullable
    BEGIN
      -- Check if sku column is NOT NULL
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns c
        WHERE c.table_name = 'products'
        AND c.column_name = 'sku'
        AND c.is_nullable = 'NO'
      ) THEN
        -- Make it nullable
        ALTER TABLE products ALTER COLUMN sku DROP NOT NULL;
      END IF;

      -- Check if weight column exists
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns c
        WHERE c.table_name = 'products'
        AND c.column_name = 'weight'
      ) THEN
        -- Check if it's NOT NULL
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns c
          WHERE c.table_name = 'products'
          AND c.column_name = 'weight'
          AND c.is_nullable = 'NO'
        ) THEN
          -- Make it nullable
          ALTER TABLE products ALTER COLUMN weight DROP NOT NULL;
        END IF;

        -- Check if it's a numeric type and we're trying to insert strings
        -- We'll use a simpler approach without DECLARE
        -- Just check if the column is a numeric type directly
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'products'
          AND column_name = 'weight'
          AND data_type IN ('numeric', 'decimal', 'integer', 'bigint', 'real', 'double precision')
        ) THEN
          -- If it's a numeric type, add a new text column for weight_text
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns c
            WHERE c.table_name = 'products'
            AND c.column_name = 'weight_text'
          ) THEN
            ALTER TABLE products ADD COLUMN weight_text TEXT;
          END IF;
        END IF;
      END IF;

      -- Make all NOT NULL columns nullable except for essential ones
      -- This is a more direct approach that doesn't require a loop
      -- id, name, slug, and price will remain NOT NULL as they are essential

      -- Check and fix common columns that might cause issues
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns c
        WHERE c.table_name = 'products'
        AND c.column_name = 'weight'
        AND c.is_nullable = 'NO'
      ) THEN
        ALTER TABLE products ALTER COLUMN weight DROP NOT NULL;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns c
        WHERE c.table_name = 'products'
        AND c.column_name = 'brand'
        AND c.is_nullable = 'NO'
      ) THEN
        ALTER TABLE products ALTER COLUMN brand DROP NOT NULL;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns c
        WHERE c.table_name = 'products'
        AND c.column_name = 'vendor'
        AND c.is_nullable = 'NO'
      ) THEN
        ALTER TABLE products ALTER COLUMN vendor DROP NOT NULL;
      END IF;

      -- Check for weight_unit column
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns c
        WHERE c.table_name = 'products'
        AND c.column_name = 'weight_unit'
        AND c.is_nullable = 'NO'
      ) THEN
        ALTER TABLE products ALTER COLUMN weight_unit DROP NOT NULL;
      END IF;

      -- Add default value for weight_unit if it exists
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns c
        WHERE c.table_name = 'products'
        AND c.column_name = 'weight_unit'
      ) THEN
        -- Update all rows with NULL weight_unit to 'g'
        UPDATE products SET weight_unit = 'g' WHERE weight_unit IS NULL;
      END IF;
    END;
  END IF;
END $$;

-- =============================================
-- PART 1: CREATE REMAINING TABLES
-- =============================================

-- Note: product_categories and products tables are already created in PART 0

-- Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, image_url)
);

-- Check if alt_text column exists and is NOT NULL
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns c
    WHERE c.table_name = 'product_images'
    AND c.column_name = 'alt_text'
    AND c.is_nullable = 'NO'
  ) THEN
    -- Make it nullable
    ALTER TABLE product_images ALTER COLUMN alt_text DROP NOT NULL;
  END IF;
END $$;

-- Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  weight TEXT,
  weight_unit TEXT,
  weight_text TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  stock_quantity INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  sku TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, name)
);

-- Check if compare_at_price column exists in product_variants
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns c
    WHERE c.table_name = 'product_variants'
    AND c.column_name = 'compare_at_price'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE product_variants ADD COLUMN compare_at_price DECIMAL(10, 2);
  END IF;

  -- Check if is_default column exists in product_variants
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns c
    WHERE c.table_name = 'product_variants'
    AND c.column_name = 'is_default'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE product_variants ADD COLUMN is_default BOOLEAN DEFAULT FALSE;
  END IF;

  -- Check if sku column exists in product_variants and is NOT NULL
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns c
    WHERE c.table_name = 'product_variants'
    AND c.column_name = 'sku'
    AND c.is_nullable = 'NO'
  ) THEN
    -- Make it nullable
    ALTER TABLE product_variants ALTER COLUMN sku DROP NOT NULL;
  END IF;

  -- Check if weight_unit column exists in product_variants and is NOT NULL
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns c
    WHERE c.table_name = 'product_variants'
    AND c.column_name = 'weight_unit'
    AND c.is_nullable = 'NO'
  ) THEN
    -- Make it nullable
    ALTER TABLE product_variants ALTER COLUMN weight_unit DROP NOT NULL;
  END IF;

  -- Add default value for weight_unit if it exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns c
    WHERE c.table_name = 'product_variants'
    AND c.column_name = 'weight_unit'
  ) THEN
    -- Update all rows with NULL weight_unit to 'g'
    UPDATE product_variants SET weight_unit = 'g' WHERE weight_unit IS NULL;
  END IF;

  -- Check if weight column is numeric and we're trying to insert strings
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'product_variants'
    AND column_name = 'weight'
    AND data_type IN ('numeric', 'decimal', 'integer', 'bigint', 'real', 'double precision')
  ) THEN
    -- If it's a numeric type, add a new text column for weight_text
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns c
      WHERE c.table_name = 'product_variants'
      AND c.column_name = 'weight_text'
    ) THEN
      ALTER TABLE product_variants ADD COLUMN weight_text TEXT;
    END IF;
  END IF;
END $$;

-- Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review Images Table
CREATE TABLE IF NOT EXISTS review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES product_reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, image_url)
);

-- User Profiles Table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT,
  birthdate DATE,
  preferences JSONB DEFAULT '{"emailNotifications": true, "smsNotifications": false, "newsletterSubscription": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address_type TEXT NOT NULL CHECK (address_type IN ('shipping', 'billing', 'both')),
  is_default BOOLEAN DEFAULT FALSE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT NOT NULL,
  delivery_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  shipping_address_id UUID REFERENCES addresses(id),
  billing_address_id UUID REFERENCES addresses(id),
  payment_method TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  shipping_method TEXT,
  tracking_number TEXT,
  notes TEXT,
  gift_message TEXT,
  is_gift BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist Items Table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Gift Box Templates Table
CREATE TABLE IF NOT EXISTS gift_box_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gift Boxes Table
CREATE TABLE IF NOT EXISTS gift_boxes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  template_id UUID NOT NULL REFERENCES gift_box_templates(id),
  name TEXT NOT NULL,
  message TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gift Box Items Table
CREATE TABLE IF NOT EXISTS gift_box_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gift_box_id UUID NOT NULL REFERENCES gift_boxes(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly')),
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'cancelled')),
  next_billing_date TIMESTAMP WITH TIME ZONE NOT NULL,
  last_billing_date TIMESTAMP WITH TIME ZONE,
  shipping_address_id UUID REFERENCES addresses(id),
  payment_method_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paused_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Subscription Items Table
CREATE TABLE IF NOT EXISTS subscription_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carts Table
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS carts_user_id_idx ON carts (user_id);

-- =============================================
-- PART 2: INSERT CATEGORIES
-- =============================================

INSERT INTO product_categories (id, name, slug, description, image, is_active, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'All Products', 'all-products', 'Browse all our premium quality products', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000002', 'Dry Fruits', 'dry-fruits', 'Premium quality dry fruits sourced from the finest farms', 'https://images.unsplash.com/photo-1596273312170-8f17f4cc9980?q=80&w=1000&auto=format&fit=crop', true, 2),
  ('00000000-0000-0000-0000-000000000003', 'Dried Fruits', 'dried-fruits', 'Delicious dried fruits packed with nutrients and flavor', 'https://images.unsplash.com/photo-1597371424128-8ffb9cb8cb36?q=80&w=1000&auto=format&fit=crop', true, 3),
  ('00000000-0000-0000-0000-000000000004', 'Nuts & Seeds', 'nuts-seeds', 'Nutritious nuts and seeds for healthy snacking', 'https://images.unsplash.com/photo-1563412885-139e4045ebc3?q=80&w=1000&auto=format&fit=crop', true, 4),
  ('00000000-0000-0000-0000-000000000005', 'Spices', 'spices', 'Aromatic spices from around the world to enhance your culinary creations', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1000&auto=format&fit=crop', true, 5),
  ('00000000-0000-0000-0000-000000000006', 'Gift Boxes', 'gift-boxes', 'Curated gift boxes perfect for any occasion', 'https://images.unsplash.com/photo-1607897441350-dc0d9c061a6f?q=80&w=1000&auto=format&fit=crop', true, 6),
  ('00000000-0000-0000-0000-000000000007', 'Organic', 'organic', 'Certified organic products for health-conscious consumers', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop', true, 7),
  ('00000000-0000-0000-0000-000000000008', 'Bestsellers', 'bestsellers', 'Our most popular products loved by customers', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop', true, 8);

-- =============================================
-- PART 3: INSERT PRODUCTS (Sample - first 3 products)
-- =============================================

-- Medjool Dates
INSERT INTO products (
  id, name, slug, description, short_description,
  price, compare_at_price, discount_percentage, origin,
  nutritional_info, stock_quantity, is_featured, is_bestseller, is_organic,
  rating, review_count, category_id, sku, weight_unit
)
VALUES (
  '00000000-0000-0000-0000-000000000101',
  'Premium Medjool Dates',
  'premium-medjool-dates',
  'Our Premium Medjool Dates are soft, sweet, and delicious, sourced from the finest date farms. These dates are known for their large size, exceptional sweetness, and caramel-like flavor. Rich in fiber, potassium, and essential nutrients, they make a perfect healthy snack or natural sweetener for your recipes. Each date is carefully selected to ensure premium quality and freshness.',
  'Premium quality Medjool dates, soft and sweet with a caramel-like flavor',
  12.99, 15.99, 19, 'Jordan',
  '{"calories": 277, "protein": "1.8g", "fat": "0.2g", "carbohydrates": "75g", "fiber": "7g", "sugar": "66g"}',
  100, true, true, true,
  4.8, 124, '00000000-0000-0000-0000-000000000002', 'MD-101', 'g'
);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000101', 'https://images.unsplash.com/photo-1593904308074-e1a3f1f0a673?q=80&w=1000&auto=format&fit=crop', 'Premium Medjool Dates in a wooden bowl', true, 1),
  ('00000000-0000-0000-0000-000000000101', 'https://images.unsplash.com/photo-1574570068036-e97e8c8c24a1?q=80&w=1000&auto=format&fit=crop', 'Close-up of Medjool Dates showing texture', false, 2);

-- Check if weight column is numeric
DO $$
DECLARE
  weight_type text;
BEGIN
  SELECT data_type INTO weight_type
  FROM information_schema.columns
  WHERE table_name = 'product_variants' AND column_name = 'weight';

  -- Check if sku column exists in product_variants
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns c
    WHERE c.table_name = 'product_variants'
    AND c.column_name = 'sku'
  ) THEN
    -- If sku column exists, include it in the INSERT
    IF weight_type IN ('numeric', 'decimal', 'integer', 'bigint', 'real', 'double precision') THEN
      -- Always include weight_unit since we've added it to the table definition
      INSERT INTO product_variants (product_id, name, weight, weight_text, price, compare_at_price, stock_quantity, is_default, sku, weight_unit)
      VALUES
        ('00000000-0000-0000-0000-000000000101', '250g', 250, '250g', 6.49, 7.99, 100, true, 'MD-101-250G', 'g'),
        ('00000000-0000-0000-0000-000000000101', '500g', 500, '500g', 12.99, 15.99, 100, false, 'MD-101-500G', 'g'),
        ('00000000-0000-0000-0000-000000000101', '1kg', 1000, '1kg', 24.99, 29.99, 100, false, 'MD-101-1KG', 'g');
    ELSE
      -- Always include weight_unit since we've added it to the table definition
      INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default, sku, weight_unit)
      VALUES
        ('00000000-0000-0000-0000-000000000101', '250g', '250g', 6.49, 7.99, 100, true, 'MD-101-250G', 'g'),
        ('00000000-0000-0000-0000-000000000101', '500g', '500g', 12.99, 15.99, 100, false, 'MD-101-500G', 'g'),
        ('00000000-0000-0000-0000-000000000101', '1kg', '1kg', 24.99, 29.99, 100, false, 'MD-101-1KG', 'g');
    END IF;
  ELSE
    -- If sku column doesn't exist, insert without it
    IF weight_type IN ('numeric', 'decimal', 'integer', 'bigint', 'real', 'double precision') THEN
      -- If weight is numeric, insert numeric values and use weight_text for the string values
      INSERT INTO product_variants (product_id, name, weight, weight_text, price, compare_at_price, stock_quantity, is_default)
      VALUES
        ('00000000-0000-0000-0000-000000000101', '250g', 250, '250g', 6.49, 7.99, 100, true),
        ('00000000-0000-0000-0000-000000000101', '500g', 500, '500g', 12.99, 15.99, 100, false),
        ('00000000-0000-0000-0000-000000000101', '1kg', 1000, '1kg', 24.99, 29.99, 100, false);
    ELSE
      -- If weight is text, insert as normal
      INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default)
      VALUES
        ('00000000-0000-0000-0000-000000000101', '250g', '250g', 6.49, 7.99, 100, true),
        ('00000000-0000-0000-0000-000000000101', '500g', '500g', 12.99, 15.99, 100, false),
        ('00000000-0000-0000-0000-000000000101', '1kg', '1kg', 24.99, 29.99, 100, false);
    END IF;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- If there's an error, try inserting with numeric values for weight and include sku
    BEGIN
      -- Always include weight_unit since we've added it to the table definition
      INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default, weight_unit)
      VALUES
        ('00000000-0000-0000-0000-000000000101', '250g', 250, 6.49, 7.99, 100, true, 'g'),
        ('00000000-0000-0000-0000-000000000101', '500g', 500, 12.99, 15.99, 100, false, 'g'),
        ('00000000-0000-0000-0000-000000000101', '1kg', 1000, 24.99, 29.99, 100, false, 'g');
    EXCEPTION
      WHEN OTHERS THEN
        -- Last resort: try with just the absolutely essential columns
        INSERT INTO product_variants (product_id, name, weight, price, stock_quantity)
        VALUES
          ('00000000-0000-0000-0000-000000000101', '250g', 250, 6.49, 100),
          ('00000000-0000-0000-0000-000000000101', '500g', 500, 12.99, 100),
          ('00000000-0000-0000-0000-000000000101', '1kg', 1000, 24.99, 100);
    END;
END $$;

-- Organic Almonds
INSERT INTO products (
  id, name, slug, description, short_description,
  price, compare_at_price, discount_percentage, origin,
  nutritional_info, stock_quantity, is_featured, is_bestseller, is_organic,
  rating, review_count, category_id, sku, weight_unit
)
VALUES (
  '00000000-0000-0000-0000-000000000102',
  'Organic Almonds',
  'organic-almonds',
  'Our Organic Almonds are premium quality nuts grown without pesticides or chemical fertilizers. These almonds have a sweet, buttery flavor and crunchy texture. They''re perfect for snacking, baking, or adding to your favorite recipes. Rich in protein, healthy fats, vitamin E, and magnesium, they make a nutritious addition to any diet. Each batch is carefully selected to ensure the highest quality.',
  'Premium quality organic almonds with a sweet, buttery flavor',
  14.99, 17.99, 17, 'California',
  '{"calories": 579, "protein": "21g", "fat": "49.9g", "carbohydrates": "21.6g", "fiber": "12.5g", "sugar": "4.4g"}',
  100, true, true, true,
  4.7, 98, '00000000-0000-0000-0000-000000000004', 'OA-102', 'g'
);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000102', 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=1000&auto=format&fit=crop', 'Organic almonds in a small bowl', true, 1),
  ('00000000-0000-0000-0000-000000000102', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=1000&auto=format&fit=crop', 'Close-up of almonds showing texture and color', false, 2);

-- Check if weight column is numeric for Organic Almonds variants
DO $$
DECLARE
  weight_type text;
BEGIN
  SELECT data_type INTO weight_type
  FROM information_schema.columns
  WHERE table_name = 'product_variants' AND column_name = 'weight';

  -- Check if sku column exists in product_variants
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns c
    WHERE c.table_name = 'product_variants'
    AND c.column_name = 'sku'
  ) THEN
    -- If sku column exists, include it in the INSERT
    IF weight_type IN ('numeric', 'decimal', 'integer', 'bigint', 'real', 'double precision') THEN
      -- If weight is numeric, insert numeric values and use weight_text for the string values
      INSERT INTO product_variants (product_id, name, weight, weight_text, price, compare_at_price, stock_quantity, is_default, sku, weight_unit)
      VALUES
        ('00000000-0000-0000-0000-000000000102', '250g', 250, '250g', 7.49, 8.99, 100, true, 'OA-102-250G', 'g'),
        ('00000000-0000-0000-0000-000000000102', '500g', 500, '500g', 14.99, 17.99, 100, false, 'OA-102-500G', 'g'),
        ('00000000-0000-0000-0000-000000000102', '1kg', 1000, '1kg', 28.99, 34.99, 100, false, 'OA-102-1KG', 'g');
    ELSE
      -- If weight is text, insert as normal
      INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default, sku, weight_unit)
      VALUES
        ('00000000-0000-0000-0000-000000000102', '250g', '250g', 7.49, 8.99, 100, true, 'OA-102-250G', 'g'),
        ('00000000-0000-0000-0000-000000000102', '500g', '500g', 14.99, 17.99, 100, false, 'OA-102-500G', 'g'),
        ('00000000-0000-0000-0000-000000000102', '1kg', '1kg', 28.99, 34.99, 100, false, 'OA-102-1KG', 'g');
    END IF;
  ELSE
    -- If sku column doesn't exist, insert without it
    IF weight_type IN ('numeric', 'decimal', 'integer', 'bigint', 'real', 'double precision') THEN
      -- If weight is numeric, insert numeric values and use weight_text for the string values
      INSERT INTO product_variants (product_id, name, weight, weight_text, price, compare_at_price, stock_quantity, is_default)
      VALUES
        ('00000000-0000-0000-0000-000000000102', '250g', 250, '250g', 7.49, 8.99, 100, true),
        ('00000000-0000-0000-0000-000000000102', '500g', 500, '500g', 14.99, 17.99, 100, false),
        ('00000000-0000-0000-0000-000000000102', '1kg', 1000, '1kg', 28.99, 34.99, 100, false);
    ELSE
      -- If weight is text, insert as normal
      INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default)
      VALUES
        ('00000000-0000-0000-0000-000000000102', '250g', '250g', 7.49, 8.99, 100, true),
        ('00000000-0000-0000-0000-000000000102', '500g', '500g', 14.99, 17.99, 100, false),
        ('00000000-0000-0000-0000-000000000102', '1kg', '1kg', 28.99, 34.99, 100, false);
    END IF;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- If there's an error, try inserting with numeric values for weight and include sku
    BEGIN
      INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default, sku, weight_unit)
      VALUES
        ('00000000-0000-0000-0000-000000000102', '250g', 250, 7.49, 8.99, 100, true, 'OA-102-250G', 'g'),
        ('00000000-0000-0000-0000-000000000102', '500g', 500, 14.99, 17.99, 100, false, 'OA-102-500G', 'g'),
        ('00000000-0000-0000-0000-000000000102', '1kg', 1000, 28.99, 34.99, 100, false, 'OA-102-1KG', 'g');
    EXCEPTION
      WHEN OTHERS THEN
        -- If that fails too, try with weight_unit but without sku
        BEGIN
          INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default, weight_unit)
          VALUES
            ('00000000-0000-0000-0000-000000000102', '250g', 250, 7.49, 8.99, 100, true, 'g'),
            ('00000000-0000-0000-0000-000000000102', '500g', 500, 14.99, 17.99, 100, false, 'g'),
            ('00000000-0000-0000-0000-000000000102', '1kg', 1000, 28.99, 34.99, 100, false, 'g');
        EXCEPTION
          WHEN OTHERS THEN
            -- Last resort: try with just the absolutely essential columns
            INSERT INTO product_variants (product_id, name, weight, price, stock_quantity)
            VALUES
              ('00000000-0000-0000-0000-000000000102', '250g', 250, 7.49, 100),
              ('00000000-0000-0000-0000-000000000102', '500g', 500, 14.99, 100),
              ('00000000-0000-0000-0000-000000000102', '1kg', 1000, 28.99, 100);
        END;
    END;
END $$;

-- Raw Cashews
INSERT INTO products (
  id, name, slug, description, short_description,
  price, compare_at_price, discount_percentage, origin,
  nutritional_info, stock_quantity, is_featured, is_bestseller, is_organic,
  rating, review_count, category_id, sku, weight_unit
)
VALUES (
  '00000000-0000-0000-0000-000000000103',
  'Raw Cashews',
  'raw-cashews',
  'Our Raw Cashews are creamy and delicious nuts with a mild, sweet flavor. These versatile nuts are perfect for snacking, cooking, or making homemade cashew milk and butter. They''re rich in heart-healthy monounsaturated fats, protein, and essential minerals like copper, magnesium, and zinc. Our cashews are carefully selected and processed to preserve their natural flavor and nutritional benefits.',
  'Premium quality raw cashews with a mild, sweet flavor',
  16.99, 19.99, 15, 'Vietnam',
  '{"calories": 553, "protein": "18g", "fat": "43.8g", "carbohydrates": "30.2g", "fiber": "3.3g", "sugar": "5.9g"}',
  100, false, true, false,
  4.6, 87, '00000000-0000-0000-0000-000000000004', 'RC-103', 'g'
);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000103', 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2b?q=80&w=1000&auto=format&fit=crop', 'Raw cashews in a wooden bowl', true, 1),
  ('00000000-0000-0000-0000-000000000103', 'https://images.unsplash.com/photo-1570283626328-53f8bfd59a0b?q=80&w=1000&auto=format&fit=crop', 'Pile of raw cashews showing texture', false, 2);

-- Check if weight column is numeric for Raw Cashews variants
DO $$
DECLARE
  weight_type text;
BEGIN
  SELECT data_type INTO weight_type
  FROM information_schema.columns
  WHERE table_name = 'product_variants' AND column_name = 'weight';

  -- Check if sku column exists in product_variants
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns c
    WHERE c.table_name = 'product_variants'
    AND c.column_name = 'sku'
  ) THEN
    -- If sku column exists, include it in the INSERT
    IF weight_type IN ('numeric', 'decimal', 'integer', 'bigint', 'real', 'double precision') THEN
      -- If weight is numeric, insert numeric values and use weight_text for the string values
      INSERT INTO product_variants (product_id, name, weight, weight_text, price, compare_at_price, stock_quantity, is_default, sku, weight_unit)
      VALUES
        ('00000000-0000-0000-0000-000000000103', '250g', 250, '250g', 8.49, 9.99, 100, true, 'RC-103-250G', 'g'),
        ('00000000-0000-0000-0000-000000000103', '500g', 500, '500g', 16.99, 19.99, 100, false, 'RC-103-500G', 'g'),
        ('00000000-0000-0000-0000-000000000103', '1kg', 1000, '1kg', 32.99, 38.99, 100, false, 'RC-103-1KG', 'g');
    ELSE
      -- If weight is text, insert as normal
      INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default, sku, weight_unit)
      VALUES
        ('00000000-0000-0000-0000-000000000103', '250g', '250g', 8.49, 9.99, 100, true, 'RC-103-250G', 'g'),
        ('00000000-0000-0000-0000-000000000103', '500g', '500g', 16.99, 19.99, 100, false, 'RC-103-500G', 'g'),
        ('00000000-0000-0000-0000-000000000103', '1kg', '1kg', 32.99, 38.99, 100, false, 'RC-103-1KG', 'g');
    END IF;
  ELSE
    -- If sku column doesn't exist, insert without it
    IF weight_type IN ('numeric', 'decimal', 'integer', 'bigint', 'real', 'double precision') THEN
      -- If weight is numeric, insert numeric values and use weight_text for the string values
      INSERT INTO product_variants (product_id, name, weight, weight_text, price, compare_at_price, stock_quantity, is_default)
      VALUES
        ('00000000-0000-0000-0000-000000000103', '250g', 250, '250g', 8.49, 9.99, 100, true),
        ('00000000-0000-0000-0000-000000000103', '500g', 500, '500g', 16.99, 19.99, 100, false),
        ('00000000-0000-0000-0000-000000000103', '1kg', 1000, '1kg', 32.99, 38.99, 100, false);
    ELSE
      -- If weight is text, insert as normal
      INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default)
      VALUES
        ('00000000-0000-0000-0000-000000000103', '250g', '250g', 8.49, 9.99, 100, true),
        ('00000000-0000-0000-0000-000000000103', '500g', '500g', 16.99, 19.99, 100, false),
        ('00000000-0000-0000-0000-000000000103', '1kg', '1kg', 32.99, 38.99, 100, false);
    END IF;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- If there's an error, try inserting with numeric values for weight and include sku
    BEGIN
      INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default, sku, weight_unit)
      VALUES
        ('00000000-0000-0000-0000-000000000103', '250g', 250, 8.49, 9.99, 100, true, 'RC-103-250G', 'g'),
        ('00000000-0000-0000-0000-000000000103', '500g', 500, 16.99, 19.99, 100, false, 'RC-103-500G', 'g'),
        ('00000000-0000-0000-0000-000000000103', '1kg', 1000, 32.99, 38.99, 100, false, 'RC-103-1KG', 'g');
    EXCEPTION
      WHEN OTHERS THEN
        -- If that fails too, try with weight_unit but without sku
        BEGIN
          INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default, weight_unit)
          VALUES
            ('00000000-0000-0000-0000-000000000103', '250g', 250, 8.49, 9.99, 100, true, 'g'),
            ('00000000-0000-0000-0000-000000000103', '500g', 500, 16.99, 19.99, 100, false, 'g'),
            ('00000000-0000-0000-0000-000000000103', '1kg', 1000, 32.99, 38.99, 100, false, 'g');
        EXCEPTION
          WHEN OTHERS THEN
            -- Last resort: try with just the absolutely essential columns
            INSERT INTO product_variants (product_id, name, weight, price, stock_quantity)
            VALUES
              ('00000000-0000-0000-0000-000000000103', '250g', 250, 8.49, 100),
              ('00000000-0000-0000-0000-000000000103', '500g', 500, 16.99, 100),
              ('00000000-0000-0000-0000-000000000103', '1kg', 1000, 32.99, 100);
        END;
    END;
END $$;

-- =============================================
-- PART 4: INSERT REVIEWS (Sample - for first product)
-- =============================================

INSERT INTO product_reviews (
  id, product_id, user_id, user_name, user_avatar,
  rating, title, content, is_verified, helpful_count
)
VALUES
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000101',
    NULL,
    'John Doe',
    'https://randomuser.me/api/portraits/men/1.jpg',
    5,
    'Excellent quality dates',
    'These are the best dates I''ve ever had. They''re fresh, sweet, and have a wonderful flavor. Will definitely buy again!',
    true,
    12
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000101',
    NULL,
    'Jane Smith',
    'https://randomuser.me/api/portraits/women/2.jpg',
    4,
    'Very good but a bit pricey',
    'The dates are excellent quality, but I found them a bit expensive compared to my local store. Still, the quality is superior.',
    true,
    8
  );

INSERT INTO review_images (review_id, image_url, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000201', 'https://images.unsplash.com/photo-1574570068036-e97e8c8c24a1?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 1);

-- Check if alt_text column exists in review_images and is NOT NULL
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns c
    WHERE c.table_name = 'review_images'
    AND c.column_name = 'alt_text'
    AND c.is_nullable = 'NO'
  ) THEN
    -- Make it nullable
    ALTER TABLE review_images ALTER COLUMN alt_text DROP NOT NULL;
  END IF;
END $$;

-- =============================================
-- PART 5: INSERT GIFT BOX TEMPLATES (Sample - first 2)
-- =============================================

INSERT INTO gift_box_templates (
  id, name, description, image_url, base_price, is_active
)
VALUES
  (
    '00000000-0000-0000-0000-000000000301',
    'Gourmet Delight Box',
    'A carefully curated selection of our finest dry fruits and spices, perfect for gifting. This premium gift box includes a variety of our most popular products, beautifully packaged in an elegant box.',
    'https://images.unsplash.com/photo-1607897441350-dc0d9c061a6f?q=80&w=1000&auto=format&fit=crop',
    49.99,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    'Nut Lover''s Collection',
    'A premium selection of our finest nuts, perfect for the nut enthusiast in your life. This gift box includes a variety of high-quality nuts, from almonds and cashews to pistachios and walnuts.',
    'https://images.unsplash.com/photo-1599003037886-98d5c8a6a0fc?q=80&w=1000&auto=format&fit=crop',
    39.99,
    true
  );

-- =============================================
-- PART 6: INSERT SUBSCRIPTION PLANS
-- =============================================

INSERT INTO subscription_plans (
  id, name, description, frequency, discount_percentage, is_active
)
VALUES
  (
    '00000000-0000-0000-0000-000000000401',
    'Weekly',
    'Get your favorite products delivered every week. Perfect for regular consumers who want to ensure they never run out of their essential items.',
    'weekly',
    15,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000402',
    'Biweekly',
    'Get your favorite products delivered every two weeks. A balanced option for moderate consumers.',
    'biweekly',
    12,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000403',
    'Monthly',
    'Get your favorite products delivered every month. Ideal for occasional consumers or those who use our products sparingly.',
    'monthly',
    10,
    true
  );

-- =============================================
-- PART 7: ENABLE ROW LEVEL SECURITY (RLS)
-- =============================================

-- Only apply RLS if auth.uid() function exists
DO $$
BEGIN
  -- Check if auth.uid() function exists
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'auth' AND p.proname = 'uid'
  ) THEN
    -- Product Categories
    ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
    EXECUTE 'CREATE POLICY "Allow public read access" ON product_categories FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "Allow admin full access" ON product_categories FOR ALL USING (
      (SELECT role FROM auth.users WHERE id = auth.uid()) = ''admin''
    )';

    -- Products
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    EXECUTE 'CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "Allow admin full access" ON products FOR ALL USING (
      (SELECT role FROM auth.users WHERE id = auth.uid()) = ''admin''
    )';

    -- Product Images
    ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
    EXECUTE 'CREATE POLICY "Allow public read access" ON product_images FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "Allow admin full access" ON product_images FOR ALL USING (
      (SELECT role FROM auth.users WHERE id = auth.uid()) = ''admin''
    )';

    -- Product Variants
    ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
    EXECUTE 'CREATE POLICY "Allow public read access" ON product_variants FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "Allow admin full access" ON product_variants FOR ALL USING (
      (SELECT role FROM auth.users WHERE id = auth.uid()) = ''admin''
    )';

    -- User Profiles - Check if user_id column exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'user_profiles' AND column_name = 'user_id'
    ) THEN
      ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
      EXECUTE 'CREATE POLICY "Allow users to view their own profile" ON user_profiles FOR SELECT USING (
        auth.uid() = user_id
      )';
      EXECUTE 'CREATE POLICY "Allow users to update their own profile" ON user_profiles FOR UPDATE USING (
        auth.uid() = user_id
      )';
      EXECUTE 'CREATE POLICY "Allow users to insert their own profile" ON user_profiles FOR INSERT WITH CHECK (
        auth.uid() = user_id
      )';
      EXECUTE 'CREATE POLICY "Allow admin full access" ON user_profiles FOR ALL USING (
        (SELECT role FROM auth.users WHERE id = auth.uid()) = ''admin''
      )';
    END IF;

    -- Wishlist Items - Check if user_id column exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'wishlist_items' AND column_name = 'user_id'
    ) THEN
      ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
      EXECUTE 'CREATE POLICY "Allow users to view their own wishlist" ON wishlist_items FOR SELECT USING (
        auth.uid() = user_id
      )';
      EXECUTE 'CREATE POLICY "Allow users to insert items to their own wishlist" ON wishlist_items FOR INSERT WITH CHECK (
        auth.uid() = user_id
      )';
      EXECUTE 'CREATE POLICY "Allow users to delete items from their own wishlist" ON wishlist_items FOR DELETE USING (
        auth.uid() = user_id
      )';
      EXECUTE 'CREATE POLICY "Allow admin full access" ON wishlist_items FOR ALL USING (
        (SELECT role FROM auth.users WHERE id = auth.uid()) = ''admin''
      )';
    END IF;

    -- Carts - Check if user_id column exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'carts' AND column_name = 'user_id'
    ) THEN
      ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
      EXECUTE 'CREATE POLICY "Allow users to view their own cart" ON carts FOR SELECT USING (
        auth.uid() = user_id
      )';
      EXECUTE 'CREATE POLICY "Allow users to update their own cart" ON carts FOR UPDATE USING (
        auth.uid() = user_id
      )';
      EXECUTE 'CREATE POLICY "Allow users to insert their own cart" ON carts FOR INSERT WITH CHECK (
        auth.uid() = user_id
      )';
      EXECUTE 'CREATE POLICY "Allow users to delete their own cart" ON carts FOR DELETE USING (
        auth.uid() = user_id
      )';
      EXECUTE 'CREATE POLICY "Allow admin full access" ON carts FOR ALL USING (
        (SELECT role FROM auth.users WHERE id = auth.uid()) = ''admin''
      )';
    END IF;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error applying RLS policies: %', SQLERRM;
END $$;
