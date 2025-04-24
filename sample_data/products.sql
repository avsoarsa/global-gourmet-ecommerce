-- Get category IDs
DO $$
DECLARE
    dry_fruits_id UUID;
    dried_fruits_id UUID;
    spices_id UUID;
    nuts_id UUID;
    seeds_id UUID;
    gift_boxes_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO dry_fruits_id FROM product_categories WHERE slug = 'dry-fruits';
    SELECT id INTO dried_fruits_id FROM product_categories WHERE slug = 'dried-fruits';
    SELECT id INTO spices_id FROM product_categories WHERE slug = 'spices';
    SELECT id INTO nuts_id FROM product_categories WHERE slug = 'nuts';
    SELECT id INTO seeds_id FROM product_categories WHERE slug = 'seeds';
    SELECT id INTO gift_boxes_id FROM product_categories WHERE slug = 'gift-boxes';

    -- Insert Dry Fruits products
    INSERT INTO products (
        id, name, slug, description, short_description, price, compare_at_price, 
        cost_price, sku, weight, weight_unit, stock_quantity, low_stock_threshold, 
        category_id, is_featured, is_active, is_organic, is_bestseller, created_at, updated_at
    )
    VALUES
        (
            gen_random_uuid(), 'Premium Almonds', 'premium-almonds',
            'Our premium almonds are sourced from the finest orchards in California. They are carefully selected for their size, flavor, and nutritional value. These almonds are perfect for snacking, baking, or adding to your favorite recipes. Rich in protein, fiber, and healthy fats, they make a nutritious addition to any diet.',
            'Premium quality almonds sourced from California, perfect for snacking and cooking.',
            12.99, 14.99, 8.50, 'ALM-001', 500, 'g', 100, 10, dry_fruits_id, true, true, true, true, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Cashew Nuts', 'cashew-nuts',
            'Our cashew nuts are sourced from the finest orchards and are known for their creamy texture and sweet flavor. They are carefully processed to preserve their nutritional value and taste. These cashews are perfect for snacking, adding to salads, or using in your favorite recipes. They are rich in heart-healthy fats, protein, and essential minerals.',
            'Creamy and delicious cashew nuts, perfect for snacking and cooking.',
            14.99, 16.99, 10.50, 'CSH-001', 500, 'g', 80, 10, dry_fruits_id, true, true, false, true, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Organic Walnuts', 'organic-walnuts',
            'Our organic walnuts are grown without the use of synthetic pesticides or fertilizers. They are harvested at peak ripeness and carefully processed to preserve their nutritional value and flavor. These walnuts have a rich, earthy flavor and are packed with omega-3 fatty acids, antioxidants, and other essential nutrients. They are perfect for snacking, baking, or adding to salads and other dishes.',
            'Organic walnuts with a rich, earthy flavor, packed with omega-3 fatty acids.',
            16.99, 18.99, 12.50, 'WLN-001', 500, 'g', 60, 10, dry_fruits_id, false, true, true, false, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Pistachios', 'pistachios',
            'Our pistachios are sourced from the finest orchards and are known for their distinctive flavor and nutritional benefits. They are carefully roasted to enhance their flavor and are lightly salted to perfection. These pistachios are perfect for snacking, adding to salads, or using in your favorite recipes. They are rich in protein, fiber, and antioxidants.',
            'Delicious pistachios, lightly roasted and salted to perfection.',
            18.99, 20.99, 14.50, 'PST-001', 500, 'g', 70, 10, dry_fruits_id, false, true, false, false, NOW(), NOW()
        );

    -- Insert Dried Fruits products
    INSERT INTO products (
        id, name, slug, description, short_description, price, compare_at_price, 
        cost_price, sku, weight, weight_unit, stock_quantity, low_stock_threshold, 
        category_id, is_featured, is_active, is_organic, is_bestseller, created_at, updated_at
    )
    VALUES
        (
            gen_random_uuid(), 'Organic Dried Apricots', 'organic-dried-apricots',
            'Our organic dried apricots are sourced from the finest orchards and are dried naturally without any added sugar or preservatives. They have a sweet, tangy flavor and a chewy texture. These apricots are perfect for snacking, adding to cereals, or using in your favorite recipes. They are rich in fiber, vitamins, and antioxidants.',
            'Sweet and tangy organic dried apricots with no added sugar or preservatives.',
            9.99, 11.99, 6.50, 'APR-001', 250, 'g', 90, 10, dried_fruits_id, true, true, true, true, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Dried Cranberries', 'dried-cranberries',
            'Our dried cranberries are made from the finest cranberries and are sweetened with just the right amount of sugar. They have a sweet-tart flavor and a chewy texture. These cranberries are perfect for snacking, adding to cereals, or using in your favorite recipes. They are rich in antioxidants and other essential nutrients.',
            'Sweet-tart dried cranberries, perfect for snacking and baking.',
            8.99, 10.99, 5.50, 'CRN-001', 250, 'g', 100, 10, dried_fruits_id, false, true, false, true, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Organic Dried Figs', 'organic-dried-figs',
            'Our organic dried figs are sourced from the finest orchards and are dried naturally without any added sugar or preservatives. They have a sweet, honey-like flavor and a chewy texture with crunchy seeds. These figs are perfect for snacking, adding to cereals, or using in your favorite recipes. They are rich in fiber, vitamins, and minerals.',
            'Sweet, honey-like organic dried figs with no added sugar or preservatives.',
            12.99, 14.99, 8.50, 'FIG-001', 250, 'g', 70, 10, dried_fruits_id, true, true, true, false, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Dried Blueberries', 'dried-blueberries',
            'Our dried blueberries are made from the finest blueberries and are sweetened with just the right amount of sugar. They have a sweet, fruity flavor and a chewy texture. These blueberries are perfect for snacking, adding to cereals, or using in your favorite recipes. They are rich in antioxidants and other essential nutrients.',
            'Sweet, fruity dried blueberries, perfect for snacking and baking.',
            14.99, 16.99, 10.50, 'BLB-001', 250, 'g', 60, 10, dried_fruits_id, false, true, false, false, NOW(), NOW()
        );

    -- Insert Spices products
    INSERT INTO products (
        id, name, slug, description, short_description, price, compare_at_price, 
        cost_price, sku, weight, weight_unit, stock_quantity, low_stock_threshold, 
        category_id, is_featured, is_active, is_organic, is_bestseller, created_at, updated_at
    )
    VALUES
        (
            gen_random_uuid(), 'Organic Turmeric Powder', 'organic-turmeric-powder',
            'Our organic turmeric powder is made from the finest turmeric roots and is ground to a fine powder. It has a warm, earthy flavor with a hint of bitterness. This turmeric powder is perfect for adding to curries, soups, or other dishes. It is rich in curcumin, a compound with powerful anti-inflammatory and antioxidant properties.',
            'Organic turmeric powder with a warm, earthy flavor, rich in curcumin.',
            7.99, 9.99, 4.50, 'TRM-001', 100, 'g', 120, 10, spices_id, true, true, true, true, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Cinnamon Sticks', 'cinnamon-sticks',
            'Our cinnamon sticks are made from the finest cinnamon bark and have a sweet, warm flavor with a hint of spice. These cinnamon sticks are perfect for adding to teas, coffees, or other beverages, or for using in your favorite recipes. They are rich in antioxidants and other essential nutrients.',
            'Sweet, warm cinnamon sticks, perfect for teas, coffees, and cooking.',
            6.99, 8.99, 3.50, 'CIN-001', 50, 'g', 100, 10, spices_id, false, true, false, true, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Organic Cumin Seeds', 'organic-cumin-seeds',
            'Our organic cumin seeds are sourced from the finest farms and are known for their distinctive flavor and aroma. They have a warm, earthy flavor with a hint of citrus. These cumin seeds are perfect for adding to curries, soups, or other dishes. They are rich in iron, manganese, and other essential nutrients.',
            'Organic cumin seeds with a warm, earthy flavor, perfect for curries and soups.',
            5.99, 7.99, 3.00, 'CUM-001', 100, 'g', 90, 10, spices_id, true, true, true, false, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Black Peppercorns', 'black-peppercorns',
            'Our black peppercorns are sourced from the finest farms and are known for their distinctive flavor and aroma. They have a sharp, pungent flavor with a hint of heat. These peppercorns are perfect for adding to any dish that needs a bit of spice. They are rich in piperine, a compound with potential health benefits.',
            'Sharp, pungent black peppercorns, perfect for adding spice to any dish.',
            8.99, 10.99, 5.50, 'BPP-001', 100, 'g', 80, 10, spices_id, false, true, false, false, NOW(), NOW()
        );

    -- Insert Nuts products
    INSERT INTO products (
        id, name, slug, description, short_description, price, compare_at_price, 
        cost_price, sku, weight, weight_unit, stock_quantity, low_stock_threshold, 
        category_id, is_featured, is_active, is_organic, is_bestseller, created_at, updated_at
    )
    VALUES
        (
            gen_random_uuid(), 'Organic Brazil Nuts', 'organic-brazil-nuts',
            'Our organic Brazil nuts are sourced from the Amazon rainforest and are known for their rich, creamy flavor. They are carefully selected for their size and quality. These Brazil nuts are perfect for snacking, adding to salads, or using in your favorite recipes. They are one of the richest dietary sources of selenium, an important antioxidant.',
            'Organic Brazil nuts with a rich, creamy flavor, high in selenium.',
            15.99, 17.99, 11.50, 'BRZ-001', 500, 'g', 60, 10, nuts_id, true, true, true, true, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Macadamia Nuts', 'macadamia-nuts',
            'Our macadamia nuts are sourced from the finest orchards and are known for their buttery flavor and creamy texture. They are carefully roasted to enhance their flavor. These macadamia nuts are perfect for snacking, adding to salads, or using in your favorite recipes. They are rich in heart-healthy monounsaturated fats.',
            'Buttery, creamy macadamia nuts, perfect for snacking and cooking.',
            19.99, 21.99, 15.50, 'MAC-001', 500, 'g', 50, 10, nuts_id, false, true, false, true, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Organic Hazelnuts', 'organic-hazelnuts',
            'Our organic hazelnuts are sourced from the finest orchards and are known for their sweet, nutty flavor. They are carefully roasted to enhance their flavor. These hazelnuts are perfect for snacking, adding to salads, or using in your favorite recipes. They are rich in vitamin E, copper, and other essential nutrients.',
            'Organic hazelnuts with a sweet, nutty flavor, rich in vitamin E.',
            14.99, 16.99, 10.50, 'HZL-001', 500, 'g', 70, 10, nuts_id, true, true, true, false, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Pine Nuts', 'pine-nuts',
            'Our pine nuts are sourced from the finest pine forests and are known for their delicate, sweet flavor. They are carefully processed to preserve their nutritional value and taste. These pine nuts are perfect for adding to salads, pesto, or other dishes. They are rich in protein, iron, and other essential nutrients.',
            'Delicate, sweet pine nuts, perfect for salads, pesto, and other dishes.',
            22.99, 24.99, 18.50, 'PIN-001', 250, 'g', 40, 10, nuts_id, false, true, false, false, NOW(), NOW()
        );

    -- Insert Seeds products
    INSERT INTO products (
        id, name, slug, description, short_description, price, compare_at_price, 
        cost_price, sku, weight, weight_unit, stock_quantity, low_stock_threshold, 
        category_id, is_featured, is_active, is_organic, is_bestseller, created_at, updated_at
    )
    VALUES
        (
            gen_random_uuid(), 'Organic Chia Seeds', 'organic-chia-seeds',
            'Our organic chia seeds are sourced from the finest farms and are known for their nutritional benefits. They have a mild, nutty flavor and can absorb up to 10 times their weight in water. These chia seeds are perfect for adding to smoothies, yogurt, or other dishes. They are rich in omega-3 fatty acids, fiber, and protein.',
            'Organic chia seeds with a mild, nutty flavor, rich in omega-3 fatty acids.',
            9.99, 11.99, 6.50, 'CHI-001', 250, 'g', 100, 10, seeds_id, true, true, true, true, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Flaxseeds', 'flaxseeds',
            'Our flaxseeds are sourced from the finest farms and are known for their nutritional benefits. They have a nutty flavor and are rich in omega-3 fatty acids, fiber, and lignans. These flaxseeds are perfect for adding to smoothies, yogurt, or other dishes. For maximum nutritional benefit, they should be ground before consumption.',
            'Nutritious flaxseeds with a nutty flavor, rich in omega-3 fatty acids.',
            7.99, 9.99, 4.50, 'FLX-001', 250, 'g', 90, 10, seeds_id, false, true, false, true, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Organic Pumpkin Seeds', 'organic-pumpkin-seeds',
            'Our organic pumpkin seeds are sourced from the finest farms and are known for their nutritional benefits. They have a subtly sweet and nutty flavor. These pumpkin seeds are perfect for snacking, adding to salads, or using in your favorite recipes. They are rich in magnesium, zinc, and other essential nutrients.',
            'Organic pumpkin seeds with a subtly sweet and nutty flavor, rich in magnesium.',
            10.99, 12.99, 7.50, 'PMP-001', 250, 'g', 80, 10, seeds_id, true, true, true, false, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Sunflower Seeds', 'sunflower-seeds',
            'Our sunflower seeds are sourced from the finest farms and are known for their nutritional benefits. They have a mild, nutty flavor and are rich in vitamin E, magnesium, and other essential nutrients. These sunflower seeds are perfect for snacking, adding to salads, or using in your favorite recipes.',
            'Mild, nutty sunflower seeds, rich in vitamin E and magnesium.',
            6.99, 8.99, 3.50, 'SUN-001', 250, 'g', 110, 10, seeds_id, false, true, false, false, NOW(), NOW()
        );

    -- Insert Gift Boxes products
    INSERT INTO products (
        id, name, slug, description, short_description, price, compare_at_price, 
        cost_price, sku, weight, weight_unit, stock_quantity, low_stock_threshold, 
        category_id, is_featured, is_active, is_organic, is_bestseller, created_at, updated_at
    )
    VALUES
        (
            gen_random_uuid(), 'Deluxe Nut Collection', 'deluxe-nut-collection',
            'Our Deluxe Nut Collection includes a selection of our finest nuts, including almonds, cashews, walnuts, and pistachios. Each nut is carefully selected for its quality and flavor. This collection is perfect for gifting or for enjoying yourself. It comes in an elegant gift box with a personalized message card.',
            'A selection of our finest nuts in an elegant gift box, perfect for gifting.',
            39.99, 44.99, 30.00, 'GFT-001', 1000, 'g', 30, 5, gift_boxes_id, true, true, false, true, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Organic Superfood Box', 'organic-superfood-box',
            'Our Organic Superfood Box includes a selection of our finest organic superfoods, including chia seeds, flaxseeds, goji berries, and mulberries. Each superfood is carefully selected for its quality and nutritional value. This collection is perfect for health-conscious individuals. It comes in an eco-friendly gift box with a personalized message card.',
            'A selection of our finest organic superfoods in an eco-friendly gift box.',
            49.99, 54.99, 40.00, 'GFT-002', 1000, 'g', 20, 5, gift_boxes_id, true, true, true, false, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Spice Lover\'s Collection', 'spice-lovers-collection',
            'Our Spice Lover\'s Collection includes a selection of our finest spices, including turmeric, cinnamon, cumin, and black pepper. Each spice is carefully selected for its quality and flavor. This collection is perfect for cooking enthusiasts. It comes in an elegant gift box with a personalized message card and a recipe booklet.',
            'A selection of our finest spices in an elegant gift box, perfect for cooking enthusiasts.',
            34.99, 39.99, 25.00, 'GFT-003', 500, 'g', 25, 5, gift_boxes_id, false, true, false, true, NOW(), NOW()
        ),
        (
            gen_random_uuid(), 'Dried Fruit Medley', 'dried-fruit-medley',
            'Our Dried Fruit Medley includes a selection of our finest dried fruits, including apricots, cranberries, figs, and blueberries. Each fruit is carefully selected for its quality and flavor. This collection is perfect for snacking or for adding to your favorite recipes. It comes in an elegant gift box with a personalized message card.',
            'A selection of our finest dried fruits in an elegant gift box, perfect for snacking.',
            29.99, 34.99, 20.00, 'GFT-004', 750, 'g', 35, 5, gift_boxes_id, false, true, false, false, NOW(), NOW()
        );
END $$;
