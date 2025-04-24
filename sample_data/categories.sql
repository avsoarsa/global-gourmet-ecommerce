-- Insert sample categories
INSERT INTO product_categories (id, name, slug, description, image, is_active, display_order, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Dry Fruits', 'dry-fruits', 'Premium quality dry fruits sourced from the finest orchards around the world.', 'https://images.unsplash.com/photo-1616684000067-36952fde56ec?q=80&w=800', true, 1, NOW(), NOW()),
  (gen_random_uuid(), 'Dried Fruits', 'dried-fruits', 'Naturally dehydrated fruits with no added sugar or preservatives.', 'https://images.unsplash.com/photo-1596591868231-05e908752cc9?q=80&w=800', true, 2, NOW(), NOW()),
  (gen_random_uuid(), 'Spices', 'spices', 'Authentic spices that add flavor and aroma to your culinary creations.', 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=800', true, 3, NOW(), NOW()),
  (gen_random_uuid(), 'Nuts', 'nuts', 'Crunchy and nutritious nuts for snacking and cooking.', 'https://images.unsplash.com/photo-1545042745-e67d768b4a55?q=80&w=800', true, 4, NOW(), NOW()),
  (gen_random_uuid(), 'Seeds', 'seeds', 'Nutrient-rich seeds to enhance your diet and health.', 'https://images.unsplash.com/photo-1574570231616-bfceabd9b2c6?q=80&w=800', true, 5, NOW(), NOW()),
  (gen_random_uuid(), 'Gift Boxes', 'gift-boxes', 'Curated gift boxes perfect for special occasions and celebrations.', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800', true, 6, NOW(), NOW());
