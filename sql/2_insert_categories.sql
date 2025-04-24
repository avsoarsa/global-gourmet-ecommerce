-- Insert product categories

INSERT INTO product_categories (id, name, slug, description, image, is_active, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'All Products', 'all-products', 'Browse all our premium quality products', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000002', 'Dry Fruits', 'dry-fruits', 'Premium quality dry fruits sourced from the finest farms', 'https://images.unsplash.com/photo-1596273312170-8f17f4cc9980?q=80&w=1000&auto=format&fit=crop', true, 2),
  ('00000000-0000-0000-0000-000000000003', 'Dried Fruits', 'dried-fruits', 'Delicious dried fruits packed with nutrients and flavor', 'https://images.unsplash.com/photo-1597371424128-8ffb9cb8cb36?q=80&w=1000&auto=format&fit=crop', true, 3),
  ('00000000-0000-0000-0000-000000000004', 'Nuts & Seeds', 'nuts-seeds', 'Nutritious nuts and seeds for healthy snacking', 'https://images.unsplash.com/photo-1563412885-139e4045ebc3?q=80&w=1000&auto=format&fit=crop', true, 4),
  ('00000000-0000-0000-0000-000000000005', 'Spices', 'spices', 'Aromatic spices from around the world to enhance your culinary creations', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1000&auto=format&fit=crop', true, 5),
  ('00000000-0000-0000-0000-000000000006', 'Gift Boxes', 'gift-boxes', 'Curated gift boxes perfect for any occasion', 'https://images.unsplash.com/photo-1607897441350-dc0d9c061a6f?q=80&w=1000&auto=format&fit=crop', true, 6),
  ('00000000-0000-0000-0000-000000000007', 'Organic', 'organic', 'Certified organic products for health-conscious consumers', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop', true, 7),
  ('00000000-0000-0000-0000-000000000008', 'Bestsellers', 'bestsellers', 'Our most popular products loved by customers', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop', true, 8)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order;
