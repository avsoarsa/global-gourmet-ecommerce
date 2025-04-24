-- SQL script to create all necessary tables in Supabase

-- Product Categories Table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES product_categories(id),
  image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
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
  nutritional_info TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_organic BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  category_id UUID REFERENCES product_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, image_url)
);

-- Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  weight TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  stock_quantity INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, name)
);

-- Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID,
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

-- Create RLS policies for all tables

-- Product Categories
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Allow admin full access" ON product_categories FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow admin full access" ON products FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Product Images
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON product_images FOR SELECT USING (true);
CREATE POLICY "Allow admin full access" ON product_images FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Product Variants
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Allow admin full access" ON product_variants FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Product Reviews
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON product_reviews FOR SELECT USING (true);
CREATE POLICY "Allow users to create their own reviews" ON product_reviews FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND user_id = auth.uid()
);
CREATE POLICY "Allow users to update their own reviews" ON product_reviews FOR UPDATE USING (
  auth.uid() IS NOT NULL AND user_id = auth.uid()
);
CREATE POLICY "Allow admin full access" ON product_reviews FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Review Images
ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON review_images FOR SELECT USING (true);
CREATE POLICY "Allow users to add images to their own reviews" ON review_images FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND (
    SELECT user_id FROM product_reviews WHERE id = review_id
  ) = auth.uid()
);
CREATE POLICY "Allow admin full access" ON review_images FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- User Profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to view their own profile" ON user_profiles FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Allow users to update their own profile" ON user_profiles FOR UPDATE USING (
  auth.uid() = user_id
);
CREATE POLICY "Allow users to insert their own profile" ON user_profiles FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Allow admin full access" ON user_profiles FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Addresses
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to view their own addresses" ON addresses FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Allow users to update their own addresses" ON addresses FOR UPDATE USING (
  auth.uid() = user_id
);
CREATE POLICY "Allow users to insert their own addresses" ON addresses FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Allow admin full access" ON addresses FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to view their own orders" ON orders FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Allow users to insert their own orders" ON orders FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Allow admin full access" ON orders FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to view their own order items" ON order_items FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    SELECT user_id FROM orders WHERE id = order_id
  ) = auth.uid()
);
CREATE POLICY "Allow users to insert their own order items" ON order_items FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND (
    SELECT user_id FROM orders WHERE id = order_id
  ) = auth.uid()
);
CREATE POLICY "Allow admin full access" ON order_items FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Wishlist Items
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to view their own wishlist" ON wishlist_items FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Allow users to update their own wishlist" ON wishlist_items FOR UPDATE USING (
  auth.uid() = user_id
);
CREATE POLICY "Allow users to insert items to their own wishlist" ON wishlist_items FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Allow users to delete items from their own wishlist" ON wishlist_items FOR DELETE USING (
  auth.uid() = user_id
);
CREATE POLICY "Allow admin full access" ON wishlist_items FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Gift Box Templates
ALTER TABLE gift_box_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON gift_box_templates FOR SELECT USING (true);
CREATE POLICY "Allow admin full access" ON gift_box_templates FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Gift Boxes
ALTER TABLE gift_boxes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to view their own gift boxes" ON gift_boxes FOR SELECT USING (
  auth.uid() = user_id OR (session_id IS NOT NULL AND user_id IS NULL)
);
CREATE POLICY "Allow users to update their own gift boxes" ON gift_boxes FOR UPDATE USING (
  auth.uid() = user_id OR (session_id IS NOT NULL AND user_id IS NULL)
);
CREATE POLICY "Allow users to insert their own gift boxes" ON gift_boxes FOR INSERT WITH CHECK (
  auth.uid() = user_id OR (session_id IS NOT NULL AND user_id IS NULL)
);
CREATE POLICY "Allow admin full access" ON gift_boxes FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Gift Box Items
ALTER TABLE gift_box_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to view their own gift box items" ON gift_box_items FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    SELECT user_id FROM gift_boxes WHERE id = gift_box_id
  ) = auth.uid()
);
CREATE POLICY "Allow users to update their own gift box items" ON gift_box_items FOR UPDATE USING (
  auth.uid() IS NOT NULL AND (
    SELECT user_id FROM gift_boxes WHERE id = gift_box_id
  ) = auth.uid()
);
CREATE POLICY "Allow users to insert their own gift box items" ON gift_box_items FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND (
    SELECT user_id FROM gift_boxes WHERE id = gift_box_id
  ) = auth.uid()
);
CREATE POLICY "Allow admin full access" ON gift_box_items FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Subscription Plans
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "Allow admin full access" ON subscription_plans FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to view their own subscriptions" ON subscriptions FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Allow users to update their own subscriptions" ON subscriptions FOR UPDATE USING (
  auth.uid() = user_id
);
CREATE POLICY "Allow users to insert their own subscriptions" ON subscriptions FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Allow admin full access" ON subscriptions FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Subscription Items
ALTER TABLE subscription_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to view their own subscription items" ON subscription_items FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    SELECT user_id FROM subscriptions WHERE id = subscription_id
  ) = auth.uid()
);
CREATE POLICY "Allow users to update their own subscription items" ON subscription_items FOR UPDATE USING (
  auth.uid() IS NOT NULL AND (
    SELECT user_id FROM subscriptions WHERE id = subscription_id
  ) = auth.uid()
);
CREATE POLICY "Allow users to insert their own subscription items" ON subscription_items FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND (
    SELECT user_id FROM subscriptions WHERE id = subscription_id
  ) = auth.uid()
);
CREATE POLICY "Allow admin full access" ON subscription_items FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Create function to run SQL script
CREATE OR REPLACE FUNCTION run_sql_script(sql_script TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql_script;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
