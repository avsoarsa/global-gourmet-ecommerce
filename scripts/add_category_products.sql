-- Add categories if they don't exist
DO $$
DECLARE
  whole_foods_id UUID;
  sprouts_id UUID;
  superfoods_id UUID;
BEGIN
  -- Check if whole-foods category exists
  SELECT id INTO whole_foods_id FROM product_categories WHERE slug = 'whole-foods';
  IF whole_foods_id IS NULL THEN
    whole_foods_id := uuid_generate_v4();
    INSERT INTO product_categories (id, name, slug, description, image, is_active, display_order)
    VALUES (
      whole_foods_id,
      'Whole Foods',
      'whole-foods',
      'Natural, unprocessed foods that are free from additives and artificial ingredients.',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000',
      true,
      10
    );
  END IF;

  -- Check if sprouts category exists
  SELECT id INTO sprouts_id FROM product_categories WHERE slug = 'sprouts';
  IF sprouts_id IS NULL THEN
    sprouts_id := uuid_generate_v4();
    INSERT INTO product_categories (id, name, slug, description, image, is_active, display_order)
    VALUES (
      sprouts_id,
      'Sprouts',
      'sprouts',
      'Young seedlings of various seeds known for their high nutritional value and health benefits.',
      'https://images.unsplash.com/photo-1600398831028-4d707f698735?q=80&w=1000',
      true,
      20
    );
  END IF;

  -- Check if superfoods category exists
  SELECT id INTO superfoods_id FROM product_categories WHERE slug = 'superfoods';
  IF superfoods_id IS NULL THEN
    superfoods_id := uuid_generate_v4();
    INSERT INTO product_categories (id, name, slug, description, image, is_active, display_order)
    VALUES (
      superfoods_id,
      'Superfoods',
      'superfoods',
      'Nutrient-rich foods considered to be especially beneficial for health and well-being.',
      'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?q=80&w=1000',
      true,
      30
    );
  END IF;

  -- If we didn't find the IDs earlier, get them now
  IF whole_foods_id IS NULL THEN
    SELECT id INTO whole_foods_id FROM product_categories WHERE slug = 'whole-foods';
  END IF;
  
  IF sprouts_id IS NULL THEN
    SELECT id INTO sprouts_id FROM product_categories WHERE slug = 'sprouts';
  END IF;
  
  IF superfoods_id IS NULL THEN
    SELECT id INTO superfoods_id FROM product_categories WHERE slug = 'superfoods';
  END IF;

  -- Add products for Whole Foods category
  -- Product 1: Organic Quinoa
  INSERT INTO products (
    id, name, slug, description, short_description, price, sale_price, 
    stock_quantity, sku, weight, dimensions, is_active, is_featured, 
    created_at, updated_at
  )
  VALUES (
    uuid_generate_v4(),
    'Organic Quinoa',
    'organic-quinoa',
    'Premium organic quinoa, a complete protein source rich in fiber, vitamins, and minerals. Perfect for salads, bowls, and as a rice substitute.',
    'Premium organic quinoa, a complete protein source.',
    12.99,
    10.99,
    100,
    'WF-QUIN-001',
    '500g',
    '{"length": 15, "width": 10, "height": 5}',
    true,
    true,
    NOW(),
    NOW()
  );
  
  -- Link the product to the whole-foods category
  INSERT INTO product_categories_junction (product_id, category_id)
  VALUES (
    (SELECT id FROM products WHERE slug = 'organic-quinoa'),
    whole_foods_id
  );
  
  -- Add product image
  INSERT INTO product_images (id, product_id, url, is_primary)
  VALUES (
    uuid_generate_v4(),
    (SELECT id FROM products WHERE slug = 'organic-quinoa'),
    'https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=1000',
    true
  );

  -- Product 2: Brown Rice
  INSERT INTO products (
    id, name, slug, description, short_description, price, sale_price, 
    stock_quantity, sku, weight, dimensions, is_active, is_featured, 
    created_at, updated_at
  )
  VALUES (
    uuid_generate_v4(),
    'Organic Brown Rice',
    'organic-brown-rice',
    'Nutrient-rich organic brown rice with a nutty flavor and chewy texture. High in fiber, vitamins, and minerals.',
    'Nutrient-rich organic brown rice with a nutty flavor.',
    8.99,
    7.49,
    150,
    'WF-RICE-001',
    '1kg',
    '{"length": 20, "width": 15, "height": 5}',
    true,
    false,
    NOW(),
    NOW()
  );
  
  -- Link the product to the whole-foods category
  INSERT INTO product_categories_junction (product_id, category_id)
  VALUES (
    (SELECT id FROM products WHERE slug = 'organic-brown-rice'),
    whole_foods_id
  );
  
  -- Add product image
  INSERT INTO product_images (id, product_id, url, is_primary)
  VALUES (
    uuid_generate_v4(),
    (SELECT id FROM products WHERE slug = 'organic-brown-rice'),
    'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=1000',
    true
  );

  -- Product 3: Rolled Oats
  INSERT INTO products (
    id, name, slug, description, short_description, price, sale_price, 
    stock_quantity, sku, weight, dimensions, is_active, is_featured, 
    created_at, updated_at
  )
  VALUES (
    uuid_generate_v4(),
    'Organic Rolled Oats',
    'organic-rolled-oats',
    'Premium organic rolled oats, perfect for a nutritious breakfast. High in fiber and protein, these oats cook quickly and have a delicious, hearty flavor.',
    'Premium organic rolled oats for a nutritious breakfast.',
    6.99,
    5.99,
    200,
    'WF-OATS-001',
    '750g',
    '{"length": 18, "width": 12, "height": 5}',
    true,
    false,
    NOW(),
    NOW()
  );
  
  -- Link the product to the whole-foods category
  INSERT INTO product_categories_junction (product_id, category_id)
  VALUES (
    (SELECT id FROM products WHERE slug = 'organic-rolled-oats'),
    whole_foods_id
  );
  
  -- Add product image
  INSERT INTO product_images (id, product_id, url, is_primary)
  VALUES (
    uuid_generate_v4(),
    (SELECT id FROM products WHERE slug = 'organic-rolled-oats'),
    'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?q=80&w=1000',
    true
  );

  -- Add products for Sprouts category
  -- Product 1: Broccoli Sprouts
  INSERT INTO products (
    id, name, slug, description, short_description, price, sale_price, 
    stock_quantity, sku, weight, dimensions, is_active, is_featured, 
    created_at, updated_at
  )
  VALUES (
    uuid_generate_v4(),
    'Organic Broccoli Sprouts',
    'organic-broccoli-sprouts',
    'Fresh organic broccoli sprouts packed with sulforaphane, a powerful antioxidant. These sprouts have a mild, peppery flavor and are perfect for salads, sandwiches, and smoothies.',
    'Fresh organic broccoli sprouts rich in antioxidants.',
    4.99,
    4.49,
    50,
    'SP-BROC-001',
    '100g',
    '{"length": 10, "width": 10, "height": 3}',
    true,
    true,
    NOW(),
    NOW()
  );
  
  -- Link the product to the sprouts category
  INSERT INTO product_categories_junction (product_id, category_id)
  VALUES (
    (SELECT id FROM products WHERE slug = 'organic-broccoli-sprouts'),
    sprouts_id
  );
  
  -- Add product image
  INSERT INTO product_images (id, product_id, url, is_primary)
  VALUES (
    uuid_generate_v4(),
    (SELECT id FROM products WHERE slug = 'organic-broccoli-sprouts'),
    'https://images.unsplash.com/photo-1600398840285-9e649bcab85a?q=80&w=1000',
    true
  );

  -- Product 2: Alfalfa Sprouts
  INSERT INTO products (
    id, name, slug, description, short_description, price, sale_price, 
    stock_quantity, sku, weight, dimensions, is_active, is_featured, 
    created_at, updated_at
  )
  VALUES (
    uuid_generate_v4(),
    'Fresh Alfalfa Sprouts',
    'fresh-alfalfa-sprouts',
    'Crisp, delicate alfalfa sprouts with a mild, nutty flavor. Rich in vitamins A, C, and K, as well as minerals like calcium and iron. Perfect for adding to sandwiches, wraps, and salads.',
    'Crisp, delicate alfalfa sprouts with a mild, nutty flavor.',
    3.99,
    3.49,
    60,
    'SP-ALFA-001',
    '125g',
    '{"length": 10, "width": 10, "height": 3}',
    true,
    false,
    NOW(),
    NOW()
  );
  
  -- Link the product to the sprouts category
  INSERT INTO product_categories_junction (product_id, category_id)
  VALUES (
    (SELECT id FROM products WHERE slug = 'fresh-alfalfa-sprouts'),
    sprouts_id
  );
  
  -- Add product image
  INSERT INTO product_images (id, product_id, url, is_primary)
  VALUES (
    uuid_generate_v4(),
    (SELECT id FROM products WHERE slug = 'fresh-alfalfa-sprouts'),
    'https://images.unsplash.com/photo-1600398840651-2ed88cf72d2c?q=80&w=1000',
    true
  );

  -- Product 3: Mung Bean Sprouts
  INSERT INTO products (
    id, name, slug, description, short_description, price, sale_price, 
    stock_quantity, sku, weight, dimensions, is_active, is_featured, 
    created_at, updated_at
  )
  VALUES (
    uuid_generate_v4(),
    'Mung Bean Sprouts',
    'mung-bean-sprouts',
    'Crunchy, fresh mung bean sprouts, perfect for stir-fries, soups, and Asian dishes. Low in calories but high in protein, vitamins, and minerals.',
    'Crunchy, fresh mung bean sprouts for Asian cuisine.',
    2.99,
    2.49,
    80,
    'SP-MUNG-001',
    '200g',
    '{"length": 12, "width": 10, "height": 4}',
    true,
    false,
    NOW(),
    NOW()
  );
  
  -- Link the product to the sprouts category
  INSERT INTO product_categories_junction (product_id, category_id)
  VALUES (
    (SELECT id FROM products WHERE slug = 'mung-bean-sprouts'),
    sprouts_id
  );
  
  -- Add product image
  INSERT INTO product_images (id, product_id, url, is_primary)
  VALUES (
    uuid_generate_v4(),
    (SELECT id FROM products WHERE slug = 'mung-bean-sprouts'),
    'https://images.unsplash.com/photo-1603431777007-61db54157a3a?q=80&w=1000',
    true
  );

  -- Add products for Superfoods category
  -- Product 1: Organic Chia Seeds
  INSERT INTO products (
    id, name, slug, description, short_description, price, sale_price, 
    stock_quantity, sku, weight, dimensions, is_active, is_featured, 
    created_at, updated_at
  )
  VALUES (
    uuid_generate_v4(),
    'Organic Chia Seeds',
    'organic-chia-seeds',
    'Premium organic chia seeds packed with omega-3 fatty acids, fiber, protein, and antioxidants. These tiny seeds expand when soaked, making them perfect for puddings, smoothies, and as an egg substitute in baking.',
    'Premium organic chia seeds rich in omega-3 and fiber.',
    9.99,
    8.49,
    120,
    'SF-CHIA-001',
    '250g',
    '{"length": 10, "width": 7, "height": 3}',
    true,
    true,
    NOW(),
    NOW()
  );
  
  -- Link the product to the superfoods category
  INSERT INTO product_categories_junction (product_id, category_id)
  VALUES (
    (SELECT id FROM products WHERE slug = 'organic-chia-seeds'),
    superfoods_id
  );
  
  -- Add product image
  INSERT INTO product_images (id, product_id, url, is_primary)
  VALUES (
    uuid_generate_v4(),
    (SELECT id FROM products WHERE slug = 'organic-chia-seeds'),
    'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=1000',
    true
  );

  -- Product 2: Spirulina Powder
  INSERT INTO products (
    id, name, slug, description, short_description, price, sale_price, 
    stock_quantity, sku, weight, dimensions, is_active, is_featured, 
    created_at, updated_at
  )
  VALUES (
    uuid_generate_v4(),
    'Organic Spirulina Powder',
    'organic-spirulina-powder',
    'Pure organic spirulina powder, one of the most nutrient-dense foods on the planet. Rich in protein, vitamins, minerals, and antioxidants. Add to smoothies, juices, or energy balls for a nutritional boost.',
    'Pure organic spirulina powder, extremely nutrient-dense.',
    19.99,
    16.99,
    70,
    'SF-SPIR-001',
    '100g',
    '{"length": 8, "width": 8, "height": 12}',
    true,
    false,
    NOW(),
    NOW()
  );
  
  -- Link the product to the superfoods category
  INSERT INTO product_categories_junction (product_id, category_id)
  VALUES (
    (SELECT id FROM products WHERE slug = 'organic-spirulina-powder'),
    superfoods_id
  );
  
  -- Add product image
  INSERT INTO product_images (id, product_id, url, is_primary)
  VALUES (
    uuid_generate_v4(),
    (SELECT id FROM products WHERE slug = 'organic-spirulina-powder'),
    'https://images.unsplash.com/photo-1622480916113-9000ac49b79d?q=80&w=1000',
    true
  );

  -- Product 3: Goji Berries
  INSERT INTO products (
    id, name, slug, description, short_description, price, sale_price, 
    stock_quantity, sku, weight, dimensions, is_active, is_featured, 
    created_at, updated_at
  )
  VALUES (
    uuid_generate_v4(),
    'Dried Goji Berries',
    'dried-goji-berries',
    'Premium dried goji berries, known for their high antioxidant content and sweet, tangy flavor. These nutrient-dense berries are perfect for snacking, adding to trail mixes, oatmeal, or baked goods.',
    'Premium dried goji berries, high in antioxidants.',
    14.99,
    12.99,
    90,
    'SF-GOJI-001',
    '200g',
    '{"length": 15, "width": 10, "height": 3}',
    true,
    false,
    NOW(),
    NOW()
  );
  
  -- Link the product to the superfoods category
  INSERT INTO product_categories_junction (product_id, category_id)
  VALUES (
    (SELECT id FROM products WHERE slug = 'dried-goji-berries'),
    superfoods_id
  );
  
  -- Add product image
  INSERT INTO product_images (id, product_id, url, is_primary)
  VALUES (
    uuid_generate_v4(),
    (SELECT id FROM products WHERE slug = 'dried-goji-berries'),
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000',
    true
  );

END $$;
