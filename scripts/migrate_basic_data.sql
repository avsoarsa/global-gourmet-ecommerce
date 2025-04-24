-- Migrate basic product and category data

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
  ('00000000-0000-0000-0000-000000000003', 'Raw Cashews', 'raw-cashews', 'Creamy and delicious raw cashews. A versatile nut that''s perfect for snacking, cooking, or making homemade cashew milk.', 'Premium quality raw cashews', 16.99, 19.99, 15, 'Vietnam', 100, false, true, false, 4.6, 87, '00000000-0000-0000-0000-000000000004'),
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
