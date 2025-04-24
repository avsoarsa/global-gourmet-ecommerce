-- Insert products, product images, and product variants

-- Medjool Dates
INSERT INTO products (
  id, name, slug, description, short_description, 
  price, compare_at_price, discount_percentage, origin, 
  nutritional_info, stock_quantity, is_featured, is_bestseller, is_organic, 
  rating, review_count, category_id
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
  4.8, 124, '00000000-0000-0000-0000-000000000002'
);

INSERT INTO product_images (product_id, image_url, is_primary, display_order)
VALUES 
  ('00000000-0000-0000-0000-000000000101', 'https://images.unsplash.com/photo-1593904308074-e1a3f1f0a673?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000101', 'https://images.unsplash.com/photo-1574570068036-e97e8c8c24a1?q=80&w=1000&auto=format&fit=crop', false, 2),
  ('00000000-0000-0000-0000-000000000101', 'https://images.unsplash.com/photo-1601045569976-707bfe8e8dbb?q=80&w=1000&auto=format&fit=crop', false, 3);

INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default)
VALUES
  ('00000000-0000-0000-0000-000000000101', '250g', '250g', 6.49, 7.99, 100, true),
  ('00000000-0000-0000-0000-000000000101', '500g', '500g', 12.99, 15.99, 100, false),
  ('00000000-0000-0000-0000-000000000101', '1kg', '1kg', 24.99, 29.99, 100, false),
  ('00000000-0000-0000-0000-000000000101', '5kg', '5kg', 99.99, 119.99, 50, false);

-- Organic Almonds
INSERT INTO products (
  id, name, slug, description, short_description, 
  price, compare_at_price, discount_percentage, origin, 
  nutritional_info, stock_quantity, is_featured, is_bestseller, is_organic, 
  rating, review_count, category_id
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
  4.7, 98, '00000000-0000-0000-0000-000000000004'
);

INSERT INTO product_images (product_id, image_url, is_primary, display_order)
VALUES 
  ('00000000-0000-0000-0000-000000000102', 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000102', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=1000&auto=format&fit=crop', false, 2),
  ('00000000-0000-0000-0000-000000000102', 'https://images.unsplash.com/photo-1590179068383-b9c69aacebd3?q=80&w=1000&auto=format&fit=crop', false, 3);

INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default)
VALUES
  ('00000000-0000-0000-0000-000000000102', '250g', '250g', 7.49, 8.99, 100, true),
  ('00000000-0000-0000-0000-000000000102', '500g', '500g', 14.99, 17.99, 100, false),
  ('00000000-0000-0000-0000-000000000102', '1kg', '1kg', 28.99, 34.99, 100, false),
  ('00000000-0000-0000-0000-000000000102', '5kg', '5kg', 119.99, 139.99, 50, false);

-- Raw Cashews
INSERT INTO products (
  id, name, slug, description, short_description, 
  price, compare_at_price, discount_percentage, origin, 
  nutritional_info, stock_quantity, is_featured, is_bestseller, is_organic, 
  rating, review_count, category_id
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
  4.6, 87, '00000000-0000-0000-0000-000000000004'
);

INSERT INTO product_images (product_id, image_url, is_primary, display_order)
VALUES 
  ('00000000-0000-0000-0000-000000000103', 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2b?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000103', 'https://images.unsplash.com/photo-1570283626328-53f8bfd59a0b?q=80&w=1000&auto=format&fit=crop', false, 2),
  ('00000000-0000-0000-0000-000000000103', 'https://images.unsplash.com/photo-1590179068383-b9c69aacebd3?q=80&w=1000&auto=format&fit=crop', false, 3);

INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default)
VALUES
  ('00000000-0000-0000-0000-000000000103', '250g', '250g', 8.49, 9.99, 100, true),
  ('00000000-0000-0000-0000-000000000103', '500g', '500g', 16.99, 19.99, 100, false),
  ('00000000-0000-0000-0000-000000000103', '1kg', '1kg', 32.99, 38.99, 100, false),
  ('00000000-0000-0000-0000-000000000103', '5kg', '5kg', 129.99, 149.99, 50, false);

-- Dried Apricots
INSERT INTO products (
  id, name, slug, description, short_description, 
  price, compare_at_price, discount_percentage, origin, 
  nutritional_info, stock_quantity, is_featured, is_bestseller, is_organic, 
  rating, review_count, category_id
)
VALUES (
  '00000000-0000-0000-0000-000000000104', 
  'Dried Apricots', 
  'dried-apricots',
  'Our Dried Apricots are sweet and tangy treats that capture the essence of fresh apricots. These chewy, flavorful dried fruits are packed with vitamins A and E, potassium, and fiber. They make a delicious snack on their own or can be added to cereals, salads, or baked goods. Our apricots are naturally dried to preserve their vibrant color and nutritional value without added sulfites or preservatives.',
  'Sweet and tangy dried apricots packed with vitamins and minerals',
  9.99, 11.99, 17, 'Turkey',
  '{"calories": 241, "protein": "3.4g", "fat": "0.5g", "carbohydrates": "62.6g", "fiber": "7.3g", "sugar": "53.4g"}',
  100, false, false, true,
  4.5, 76, '00000000-0000-0000-0000-000000000003'
);

INSERT INTO product_images (product_id, image_url, is_primary, display_order)
VALUES 
  ('00000000-0000-0000-0000-000000000104', 'https://images.unsplash.com/photo-1597371424128-8ffb9cb8cb36?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000104', 'https://images.unsplash.com/photo-1596591868231-05e908752cc9?q=80&w=1000&auto=format&fit=crop', false, 2),
  ('00000000-0000-0000-0000-000000000104', 'https://images.unsplash.com/photo-1596591868231-05e908752cc9?q=80&w=1000&auto=format&fit=crop', false, 3);

INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default)
VALUES
  ('00000000-0000-0000-0000-000000000104', '250g', '250g', 4.99, 5.99, 100, true),
  ('00000000-0000-0000-0000-000000000104', '500g', '500g', 9.99, 11.99, 100, false),
  ('00000000-0000-0000-0000-000000000104', '1kg', '1kg', 18.99, 22.99, 100, false),
  ('00000000-0000-0000-0000-000000000104', '5kg', '5kg', 79.99, 94.99, 50, false);

-- Kashmiri Saffron
INSERT INTO products (
  id, name, slug, description, short_description, 
  price, compare_at_price, discount_percentage, origin, 
  nutritional_info, stock_quantity, is_featured, is_bestseller, is_organic, 
  rating, review_count, category_id
)
VALUES (
  '00000000-0000-0000-0000-000000000105', 
  'Kashmiri Saffron', 
  'kashmiri-saffron',
  'Our Kashmiri Saffron is known for its distinct aroma, flavor, and vibrant red color. This premium spice is harvested from the Crocus sativus flower and is considered one of the world''s most precious culinary ingredients. A little goes a long way in enhancing your dishes with its unique flavor and golden hue. Our saffron is carefully hand-picked and packaged to preserve its exceptional quality and potency.',
  'Premium Kashmiri saffron with distinct aroma and flavor',
  29.99, 34.99, 14, 'India',
  '{"calories": 310, "protein": "11.4g", "fat": "5.8g", "carbohydrates": "65.4g", "fiber": "3.9g", "sugar": "0g"}',
  50, true, false, true,
  4.9, 65, '00000000-0000-0000-0000-000000000005'
);

INSERT INTO product_images (product_id, image_url, is_primary, display_order)
VALUES 
  ('00000000-0000-0000-0000-000000000105', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000105', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop', false, 2),
  ('00000000-0000-0000-0000-000000000105', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop', false, 3);

INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default)
VALUES
  ('00000000-0000-0000-0000-000000000105', '1g', '1g', 9.99, 11.99, 100, true),
  ('00000000-0000-0000-0000-000000000105', '2g', '2g', 19.99, 23.99, 100, false),
  ('00000000-0000-0000-0000-000000000105', '5g', '5g', 49.99, 59.99, 50, false),
  ('00000000-0000-0000-0000-000000000105', '10g', '10g', 89.99, 104.99, 25, false);

-- Pistachios
INSERT INTO products (
  id, name, slug, description, short_description, 
  price, compare_at_price, discount_percentage, origin, 
  nutritional_info, stock_quantity, is_featured, is_bestseller, is_organic, 
  rating, review_count, category_id
)
VALUES (
  '00000000-0000-0000-0000-000000000106', 
  'Roasted Pistachios', 
  'roasted-pistachios',
  'Our Roasted Pistachios are premium quality nuts with a distinctive flavor and satisfying crunch. These pistachios are lightly roasted and salted to enhance their natural taste. Rich in protein, fiber, and antioxidants, they make a nutritious and delicious snack. Our pistachios are carefully selected for size and quality, ensuring you get the best nuts with easy-to-open shells and vibrant green kernels.',
  'Premium roasted and lightly salted pistachios',
  17.99, 19.99, 10, 'California',
  '{"calories": 562, "protein": "20.6g", "fat": "45.3g", "carbohydrates": "27.2g", "fiber": "10.6g", "sugar": "7.7g"}',
  100, true, true, false,
  4.7, 92, '00000000-0000-0000-0000-000000000004'
);

INSERT INTO product_images (product_id, image_url, is_primary, display_order)
VALUES 
  ('00000000-0000-0000-0000-000000000106', 'https://images.unsplash.com/photo-1583065638317-31da0cb724f4?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000106', 'https://images.unsplash.com/photo-1583065638317-31da0cb724f4?q=80&w=1000&auto=format&fit=crop', false, 2),
  ('00000000-0000-0000-0000-000000000106', 'https://images.unsplash.com/photo-1583065638317-31da0cb724f4?q=80&w=1000&auto=format&fit=crop', false, 3);

INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default)
VALUES
  ('00000000-0000-0000-0000-000000000106', '250g', '250g', 8.99, 9.99, 100, true),
  ('00000000-0000-0000-0000-000000000106', '500g', '500g', 17.99, 19.99, 100, false),
  ('00000000-0000-0000-0000-000000000106', '1kg', '1kg', 34.99, 38.99, 100, false),
  ('00000000-0000-0000-0000-000000000106', '5kg', '5kg', 149.99, 169.99, 50, false);

-- Dried Cranberries
INSERT INTO products (
  id, name, slug, description, short_description, 
  price, compare_at_price, discount_percentage, origin, 
  nutritional_info, stock_quantity, is_featured, is_bestseller, is_organic, 
  rating, review_count, category_id
)
VALUES (
  '00000000-0000-0000-0000-000000000107', 
  'Dried Cranberries', 
  'dried-cranberries',
  'Our Dried Cranberries are sweet and tangy treats that bring a burst of flavor to any dish. These ruby-red berries are carefully dried to preserve their nutritional benefits while enhancing their natural sweetness. Rich in antioxidants and vitamin C, they make a healthy addition to your diet. Perfect for snacking, baking, adding to salads, or mixing into your morning oatmeal or yogurt.',
  'Sweet and tangy dried cranberries, perfect for snacking or baking',
  8.99, 10.99, 18, 'USA',
  '{"calories": 308, "protein": "0.2g", "fat": "1.1g", "carbohydrates": "82.8g", "fiber": "2.3g", "sugar": "72.6g"}',
  100, false, true, true,
  4.6, 78, '00000000-0000-0000-0000-000000000003'
);

INSERT INTO product_images (product_id, image_url, is_primary, display_order)
VALUES 
  ('00000000-0000-0000-0000-000000000107', 'https://images.unsplash.com/photo-1611057683676-07d3f13a4f7f?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000107', 'https://images.unsplash.com/photo-1611057683676-07d3f13a4f7f?q=80&w=1000&auto=format&fit=crop', false, 2),
  ('00000000-0000-0000-0000-000000000107', 'https://images.unsplash.com/photo-1611057683676-07d3f13a4f7f?q=80&w=1000&auto=format&fit=crop', false, 3);

INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default)
VALUES
  ('00000000-0000-0000-0000-000000000107', '250g', '250g', 4.49, 5.49, 100, true),
  ('00000000-0000-0000-0000-000000000107', '500g', '500g', 8.99, 10.99, 100, false),
  ('00000000-0000-0000-0000-000000000107', '1kg', '1kg', 16.99, 19.99, 100, false),
  ('00000000-0000-0000-0000-000000000107', '5kg', '5kg', 74.99, 89.99, 50, false);

-- Turmeric Powder
INSERT INTO products (
  id, name, slug, description, short_description, 
  price, compare_at_price, discount_percentage, origin, 
  nutritional_info, stock_quantity, is_featured, is_bestseller, is_organic, 
  rating, review_count, category_id
)
VALUES (
  '00000000-0000-0000-0000-000000000108', 
  'Organic Turmeric Powder', 
  'organic-turmeric-powder',
  'Our Organic Turmeric Powder is made from high-quality turmeric roots, carefully ground to preserve its natural properties. Known for its vibrant golden color and earthy flavor, turmeric is a staple in many cuisines and has been used for centuries in traditional medicine. Rich in curcumin, a compound with powerful anti-inflammatory and antioxidant properties, our turmeric powder adds both flavor and potential health benefits to your dishes.',
  'Premium organic turmeric powder with high curcumin content',
  7.99, 9.99, 20, 'India',
  '{"calories": 312, "protein": "9.7g", "fat": "3.3g", "carbohydrates": "67.1g", "fiber": "22.7g", "sugar": "3.2g"}',
  100, true, false, true,
  4.8, 85, '00000000-0000-0000-0000-000000000005'
);

INSERT INTO product_images (product_id, image_url, is_primary, display_order)
VALUES 
  ('00000000-0000-0000-0000-000000000108', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1000&auto=format&fit=crop', true, 1),
  ('00000000-0000-0000-0000-000000000108', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1000&auto=format&fit=crop', false, 2),
  ('00000000-0000-0000-0000-000000000108', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1000&auto=format&fit=crop', false, 3);

INSERT INTO product_variants (product_id, name, weight, price, compare_at_price, stock_quantity, is_default)
VALUES
  ('00000000-0000-0000-0000-000000000108', '100g', '100g', 3.99, 4.99, 100, true),
  ('00000000-0000-0000-0000-000000000108', '250g', '250g', 7.99, 9.99, 100, false),
  ('00000000-0000-0000-0000-000000000108', '500g', '500g', 14.99, 18.99, 100, false),
  ('00000000-0000-0000-0000-000000000108', '1kg', '1kg', 27.99, 34.99, 50, false);
