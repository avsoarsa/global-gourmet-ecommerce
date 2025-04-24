-- Insert product reviews and review images

-- Reviews for Premium Medjool Dates
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
  ),
  (
    '00000000-0000-0000-0000-000000000203',
    '00000000-0000-0000-0000-000000000101',
    NULL,
    'Robert Johnson',
    'https://randomuser.me/api/portraits/men/3.jpg',
    5,
    'Perfect natural sweetener',
    'I''ve been using these dates as a natural sweetener in my smoothies and baking. They add a wonderful caramel-like flavor without refined sugar. Highly recommend!',
    true,
    15
  );

INSERT INTO review_images (review_id, image_url, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000201', 'https://images.unsplash.com/photo-1574570068036-e97e8c8c24a1?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 1),
  ('00000000-0000-0000-0000-000000000201', 'https://images.unsplash.com/photo-1601045569976-707bfe8e8dbb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 2);

-- Reviews for Organic Almonds
INSERT INTO product_reviews (
  id, product_id, user_id, user_name, user_avatar, 
  rating, title, content, is_verified, helpful_count
)
VALUES
  (
    '00000000-0000-0000-0000-000000000204',
    '00000000-0000-0000-0000-000000000102',
    NULL,
    'Michael Johnson',
    'https://randomuser.me/api/portraits/men/4.jpg',
    5,
    'Perfect almonds',
    'These organic almonds are perfect for my morning smoothie. They''re fresh, crunchy, and have a great flavor.',
    true,
    15
  ),
  (
    '00000000-0000-0000-0000-000000000205',
    '00000000-0000-0000-0000-000000000102',
    NULL,
    'Sarah Williams',
    'https://randomuser.me/api/portraits/women/5.jpg',
    4,
    'Great quality but packaging could be better',
    'The almonds themselves are excellent - fresh and flavorful. My only complaint is that the packaging isn''t resealable, so I had to transfer them to another container.',
    true,
    7
  ),
  (
    '00000000-0000-0000-0000-000000000206',
    '00000000-0000-0000-0000-000000000102',
    NULL,
    'David Brown',
    'https://randomuser.me/api/portraits/men/6.jpg',
    5,
    'Best almonds I''ve tried',
    'These organic almonds are superior to any I''ve purchased before. They have a wonderful flavor and perfect crunch. I use them for snacking and making almond milk.',
    true,
    10
  );

INSERT INTO review_images (review_id, image_url, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000204', 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 1);

-- Reviews for Raw Cashews
INSERT INTO product_reviews (
  id, product_id, user_id, user_name, user_avatar, 
  rating, title, content, is_verified, helpful_count
)
VALUES
  (
    '00000000-0000-0000-0000-000000000207',
    '00000000-0000-0000-0000-000000000103',
    NULL,
    'Emily Wilson',
    'https://randomuser.me/api/portraits/women/7.jpg',
    4,
    'Great cashews',
    'These cashews are very good quality. I use them for making homemade cashew milk and they work perfectly.',
    true,
    7
  ),
  (
    '00000000-0000-0000-0000-000000000208',
    '00000000-0000-0000-0000-000000000103',
    NULL,
    'James Taylor',
    'https://randomuser.me/api/portraits/men/8.jpg',
    5,
    'Excellent raw cashews',
    'These cashews are perfect for my vegan recipes. They''re creamy and have a mild, sweet flavor that works well in both sweet and savory dishes.',
    true,
    12
  ),
  (
    '00000000-0000-0000-0000-000000000209',
    '00000000-0000-0000-0000-000000000103',
    NULL,
    'Olivia Martinez',
    'https://randomuser.me/api/portraits/women/9.jpg',
    4,
    'Good quality but a bit pricey',
    'The cashews are excellent quality, but they are a bit expensive. Still, you get what you pay for, and these are definitely premium cashews.',
    true,
    5
  );

-- Reviews for Dried Apricots
INSERT INTO product_reviews (
  id, product_id, user_id, user_name, user_avatar, 
  rating, title, content, is_verified, helpful_count
)
VALUES
  (
    '00000000-0000-0000-0000-000000000210',
    '00000000-0000-0000-0000-000000000104',
    NULL,
    'David Brown',
    'https://randomuser.me/api/portraits/men/10.jpg',
    5,
    'Delicious apricots',
    'These dried apricots are so flavorful and juicy. Much better than the ones I usually buy at the supermarket.',
    true,
    9
  ),
  (
    '00000000-0000-0000-0000-000000000211',
    '00000000-0000-0000-0000-000000000104',
    NULL,
    'Emma Wilson',
    'https://randomuser.me/api/portraits/women/11.jpg',
    4,
    'Tasty and nutritious',
    'These apricots make a great snack. They''re sweet but not too sweet, and I appreciate that they don''t have added sulfites.',
    true,
    6
  ),
  (
    '00000000-0000-0000-0000-000000000212',
    '00000000-0000-0000-0000-000000000104',
    NULL,
    'William Davis',
    'https://randomuser.me/api/portraits/men/12.jpg',
    5,
    'Perfect for baking',
    'I use these dried apricots in my homemade granola and muffins. They add a wonderful flavor and natural sweetness. Will definitely buy again!',
    true,
    11
  );

INSERT INTO review_images (review_id, image_url, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000210', 'https://images.unsplash.com/photo-1597371424128-8ffb9cb8cb36?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 1);

-- Reviews for Kashmiri Saffron
INSERT INTO product_reviews (
  id, product_id, user_id, user_name, user_avatar, 
  rating, title, content, is_verified, helpful_count
)
VALUES
  (
    '00000000-0000-0000-0000-000000000213',
    '00000000-0000-0000-0000-000000000105',
    NULL,
    'Sophia Lee',
    'https://randomuser.me/api/portraits/women/13.jpg',
    5,
    'Exceptional quality saffron',
    'This Kashmiri saffron is exceptional. The aroma and flavor are intense, and you only need a small amount to enhance your dishes. Worth every penny!',
    true,
    14
  ),
  (
    '00000000-0000-0000-0000-000000000214',
    '00000000-0000-0000-0000-000000000105',
    NULL,
    'Daniel Garcia',
    'https://randomuser.me/api/portraits/men/14.jpg',
    5,
    'The real deal',
    'As someone who cooks a lot of Persian food, I can tell this is authentic, high-quality saffron. The color, aroma, and flavor are all excellent.',
    true,
    10
  ),
  (
    '00000000-0000-0000-0000-000000000215',
    '00000000-0000-0000-0000-000000000105',
    NULL,
    'Ava Rodriguez',
    'https://randomuser.me/api/portraits/women/15.jpg',
    4,
    'Great saffron, small quantity',
    'The quality of this saffron is excellent, but I was surprised by how small the quantity was. Still, it''s very potent and a little goes a long way.',
    true,
    8
  );

-- Reviews for Roasted Pistachios
INSERT INTO product_reviews (
  id, product_id, user_id, user_name, user_avatar, 
  rating, title, content, is_verified, helpful_count
)
VALUES
  (
    '00000000-0000-0000-0000-000000000216',
    '00000000-0000-0000-0000-000000000106',
    NULL,
    'Noah Thompson',
    'https://randomuser.me/api/portraits/men/16.jpg',
    5,
    'Perfect snack',
    'These pistachios are perfectly roasted and salted. They''re fresh, flavorful, and addictive! Great for snacking or adding to recipes.',
    true,
    11
  ),
  (
    '00000000-0000-0000-0000-000000000217',
    '00000000-0000-0000-0000-000000000106',
    NULL,
    'Isabella White',
    'https://randomuser.me/api/portraits/women/17.jpg',
    4,
    'Delicious but some shells are hard to open',
    'The pistachios taste great, but some of the shells are completely closed and hard to open. Otherwise, they''re excellent quality.',
    true,
    7
  ),
  (
    '00000000-0000-0000-0000-000000000218',
    '00000000-0000-0000-0000-000000000106',
    NULL,
    'Ethan Clark',
    'https://randomuser.me/api/portraits/men/18.jpg',
    5,
    'Fresh and flavorful',
    'These are some of the best pistachios I''ve had. They''re fresh, with a perfect amount of salt, and most of the shells are easy to open.',
    true,
    9
  );

-- Reviews for Dried Cranberries
INSERT INTO product_reviews (
  id, product_id, user_id, user_name, user_avatar, 
  rating, title, content, is_verified, helpful_count
)
VALUES
  (
    '00000000-0000-0000-0000-000000000219',
    '00000000-0000-0000-0000-000000000107',
    NULL,
    'Mia Lewis',
    'https://randomuser.me/api/portraits/women/19.jpg',
    5,
    'Perfect balance of sweet and tart',
    'These dried cranberries have the perfect balance of sweetness and tartness. They''re moist and flavorful, and I love adding them to my salads and oatmeal.',
    true,
    10
  ),
  (
    '00000000-0000-0000-0000-000000000220',
    '00000000-0000-0000-0000-000000000107',
    NULL,
    'Lucas Walker',
    'https://randomuser.me/api/portraits/men/20.jpg',
    4,
    'Good quality but a bit too sweet',
    'The cranberries are good quality, but I find them a bit too sweet for my taste. I prefer a more tart cranberry.',
    true,
    6
  ),
  (
    '00000000-0000-0000-0000-000000000221',
    '00000000-0000-0000-0000-000000000107',
    NULL,
    'Charlotte Hall',
    'https://randomuser.me/api/portraits/women/21.jpg',
    5,
    'Great for baking',
    'These cranberries are perfect for my baking needs. They add a wonderful flavor and color to my cookies and muffins.',
    true,
    8
  );

-- Reviews for Organic Turmeric Powder
INSERT INTO product_reviews (
  id, product_id, user_id, user_name, user_avatar, 
  rating, title, content, is_verified, helpful_count
)
VALUES
  (
    '00000000-0000-0000-0000-000000000222',
    '00000000-0000-0000-0000-000000000108',
    NULL,
    'Henry Young',
    'https://randomuser.me/api/portraits/men/22.jpg',
    5,
    'Vibrant color and flavor',
    'This turmeric powder has a vibrant color and rich flavor. I use it in curries, golden milk, and even smoothies. The quality is excellent!',
    true,
    12
  ),
  (
    '00000000-0000-0000-0000-000000000223',
    '00000000-0000-0000-0000-000000000108',
    NULL,
    'Amelia King',
    'https://randomuser.me/api/portraits/women/23.jpg',
    5,
    'High-quality turmeric',
    'You can tell this is high-quality turmeric by its vibrant color and potent aroma. It adds wonderful flavor to my dishes and has helped with my inflammation.',
    true,
    15
  ),
  (
    '00000000-0000-0000-0000-000000000224',
    '00000000-0000-0000-0000-000000000108',
    NULL,
    'Benjamin Scott',
    'https://randomuser.me/api/portraits/men/24.jpg',
    4,
    'Good quality but packaging could be improved',
    'The turmeric itself is excellent quality, but the packaging isn''t very practical. It would be better with a resealable container.',
    true,
    7
  );
