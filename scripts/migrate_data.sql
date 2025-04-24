-- SQL script to migrate data from frontend to Supabase
-- This script should be executed in the Supabase SQL Editor

-- First, let's create some sample categories
INSERT INTO product_categories (id, name, slug, description, image, is_active, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'All Products', 'all-products', 'Browse all our products', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000002', 'Dry Fruits', 'dry-fruits', 'Premium quality dry fruits', 'https://images.unsplash.com/photo-1596273312170-8f17f4cc9980?q=80&w=1000&auto=format&fit=crop', true, 2),
  ('00000000-0000-0000-0000-000000000003', 'Dried Fruits', 'dried-fruits', 'Delicious dried fruits', 'https://images.unsplash.com/photo-1597371424128-8ffb9cb8cb36?q=80&w=1000&auto=format&fit=crop', true, 3),
  ('00000000-0000-0000-0000-000000000004', 'Nuts & Seeds', 'nuts-seeds', 'Nutritious nuts and seeds', 'https://images.unsplash.com/photo-1563412885-139e4045ebc3?q=80&w=1000&auto=format&fit=crop', true, 4),
  ('00000000-0000-0000-0000-000000000005', 'Spices', 'spices', 'Aromatic spices from around the world', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1000&auto=format&fit=crop', true, 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order;

-- Now, let's add some sample products
INSERT INTO products (id, name, slug, description, short_description, price, compare_at_price, discount_percentage, origin, stock_quantity, is_featured, is_bestseller, is_organic, rating, review_count, category_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Premium Medjool Dates', 'premium-medjool-dates', 'Soft, sweet and delicious Medjool dates sourced from the finest date farms. Rich in fiber and essential nutrients.', 'Premium quality Medjool dates', 12.99, 15.99, 19, 'Jordan', 100, true, true, true, 4.8, 124, '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000002', 'Organic Almonds', 'organic-almonds', 'Premium quality organic almonds. Perfect for snacking or adding to your favorite recipes.', 'Premium quality organic almonds', 14.99, 17.99, 17, 'California', 100, true, true, true, 4.7, 98, '00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0000-000000000003', 'Raw Cashews', 'raw-cashews', 'Creamy and delicious raw cashews. A versatile nut that\'s perfect for snacking, cooking, or making homemade cashew milk.', 'Premium quality raw cashews', 16.99, 19.99, 15, 'Vietnam', 100, false, true, false, 4.6, 87, '00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0000-000000000004', 'Dried Apricots', 'dried-apricots', 'Sweet and tangy dried apricots. A delicious snack packed with vitamins and minerals.', 'Sweet and tangy dried apricots', 9.99, 11.99, 17, 'Turkey', 100, false, false, true, 4.5, 76, '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000005', 'Kashmiri Saffron', 'kashmiri-saffron', 'Premium Kashmiri saffron known for its distinct aroma and flavor. A little goes a long way in enhancing your dishes.', 'Premium Kashmiri saffron', 29.99, 34.99, 14, 'India', 50, true, false, true, 4.9, 65, '00000000-0000-0000-0000-000000000005')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  discount_percentage = EXCLUDED.discount_percentage,
  origin = EXCLUDED.origin,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  is_bestseller = EXCLUDED.is_bestseller,
  is_organic = EXCLUDED.is_organic,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  category_id = EXCLUDED.category_id;

-- Add product images
INSERT INTO product_images (product_id, image_url, is_primary, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1593904308074-e1a3f1f0a673?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2b?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1597371424128-8ffb9cb8cb36?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1000&auto=format&fit=crop', true, 1)
ON CONFLICT (product_id, image_url) DO NOTHING;

-- Add product variants (weight options)
INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default)
VALUES
  ('00000000-0000-0000-0000-000000000001', '250g', '250g', 6.49, 7.99, 100, true),
  ('00000000-0000-0000-0000-000000000001', '500g', '500g', 12.99, 15.99, 100, false),
  ('00000000-0000-0000-0000-000000000001', '1kg', '1kg', 24.99, 29.99, 100, false),
  ('00000000-0000-0000-0000-000000000002', '250g', '250g', 7.49, 8.99, 100, true),
  ('00000000-0000-0000-0000-000000000002', '500g', '500g', 14.99, 17.99, 100, false),
  ('00000000-0000-0000-0000-000000000002', '1kg', '1kg', 28.99, 34.99, 100, false),
  ('00000000-0000-0000-0000-000000000003', '250g', '250g', 8.49, 9.99, 100, true),
  ('00000000-0000-0000-0000-000000000003', '500g', '500g', 16.99, 19.99, 100, false),
  ('00000000-0000-0000-0000-000000000003', '1kg', '1kg', 32.99, 38.99, 100, false),
  ('00000000-0000-0000-0000-000000000004', '250g', '250g', 4.99, 5.99, 100, true),
  ('00000000-0000-0000-0000-000000000004', '500g', '500g', 9.99, 11.99, 100, false),
  ('00000000-0000-0000-0000-000000000004', '1kg', '1kg', 18.99, 22.99, 100, false),
  ('00000000-0000-0000-0000-000000000005', '1g', '1g', 9.99, 11.99, 100, true),
  ('00000000-0000-0000-0000-000000000005', '2g', '2g', 19.99, 23.99, 100, false),
  ('00000000-0000-0000-0000-000000000005', '5g', '5g', 49.99, 59.99, 50, false)
ON CONFLICT (product_id, name) DO UPDATE SET
  weight = EXCLUDED.weight,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  stock_quantity = EXCLUDED.stock_quantity,
  is_default = EXCLUDED.is_default;

-- Add product reviews
INSERT INTO product_reviews (id, product_id, user_id, user_name, user_avatar, rating, title, content, is_verified, helpful_count)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', NULL, 'John Doe', 'https://randomuser.me/api/portraits/men/1.jpg', 5, 'Excellent quality dates', 'These are the best dates I''ve ever had. They''re fresh, sweet, and have a wonderful flavor. Will definitely buy again!', true, 12),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', NULL, 'Jane Smith', 'https://randomuser.me/api/portraits/women/2.jpg', 4, 'Very good but a bit pricey', 'The dates are excellent quality, but I found them a bit expensive compared to my local store. Still, the quality is superior.', true, 8),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', NULL, 'Michael Johnson', 'https://randomuser.me/api/portraits/men/3.jpg', 5, 'Perfect almonds', 'These organic almonds are perfect for my morning smoothie. They''re fresh, crunchy, and have a great flavor.', true, 15),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', NULL, 'Emily Wilson', 'https://randomuser.me/api/portraits/women/4.jpg', 4, 'Great cashews', 'These cashews are very good quality. I use them for making homemade cashew milk and they work perfectly.', true, 7),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', NULL, 'David Brown', 'https://randomuser.me/api/portraits/men/5.jpg', 5, 'Delicious apricots', 'These dried apricots are so flavorful and juicy. Much better than the ones I usually buy at the supermarket.', true, 9)
ON CONFLICT (id) DO UPDATE SET
  product_id = EXCLUDED.product_id,
  user_name = EXCLUDED.user_name,
  user_avatar = EXCLUDED.user_avatar,
  rating = EXCLUDED.rating,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_verified = EXCLUDED.is_verified,
  helpful_count = EXCLUDED.helpful_count;

-- Add review images
INSERT INTO review_images (review_id, image_url, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1574570068036-e97e8c8c24a1?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 1),
  ('00000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 1),
  ('00000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1597371424128-8ffb9cb8cb36?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 1)
ON CONFLICT (review_id, image_url) DO NOTHING;

-- Add gift box templates
INSERT INTO gift_box_templates (id, name, description, image_url, base_price, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Gourmet Delight Box', 'A carefully curated selection of our finest dry fruits and spices, perfect for gifting.', 'https://images.unsplash.com/photo-1607897441350-dc0d9c061a6f?q=80&w=1000&auto=format&fit=crop', 49.99, true),
  ('00000000-0000-0000-0000-000000000002', 'Nut Lover''s Collection', 'A premium selection of our finest nuts, perfect for the nut enthusiast in your life.', 'https://images.unsplash.com/photo-1599003037886-98d5c8a6a0fc?q=80&w=1000&auto=format&fit=crop', 39.99, true),
  ('00000000-0000-0000-0000-000000000003', 'Spice Explorer Box', 'A collection of exotic spices from around the world, perfect for the culinary adventurer.', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1000&auto=format&fit=crop', 34.99, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  base_price = EXCLUDED.base_price,
  is_active = EXCLUDED.is_active;

-- Add subscription plans
INSERT INTO subscription_plans (id, name, description, frequency, discount_percentage, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Weekly', 'Get your favorite products delivered every week', 'weekly', 15, true),
  ('00000000-0000-0000-0000-000000000002', 'Biweekly', 'Get your favorite products delivered every two weeks', 'biweekly', 12, true),
  ('00000000-0000-0000-0000-000000000003', 'Monthly', 'Get your favorite products delivered every month', 'monthly', 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  frequency = EXCLUDED.frequency,
  discount_percentage = EXCLUDED.discount_percentage,
  is_active = EXCLUDED.is_active;
