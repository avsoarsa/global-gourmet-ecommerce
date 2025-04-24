-- Enable Row Level Security (RLS) policies for all tables

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
