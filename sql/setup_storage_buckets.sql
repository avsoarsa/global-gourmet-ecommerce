-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('product-images', 'product-images', true),
  ('review-images', 'review-images', true),
  ('user-avatars', 'user-avatars', true),
  ('gift-box-images', 'gift-box-images', true),
  ('recipe-images', 'recipe-images', true),
  ('category-images', 'category-images', true),
  ('banner-images', 'banner-images', true),
  ('blog-images', 'blog-images', true),
  ('about-images', 'about-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for product-images bucket
-- Allow anyone to read product images
CREATE POLICY "Public Access for product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated users to upload product images
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow users to update their own product images
CREATE POLICY "Users can update their own product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND auth.uid() = owner);

-- Allow users to delete their own product images
CREATE POLICY "Users can delete their own product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND auth.uid() = owner);

-- Set up RLS policies for review-images bucket
-- Allow anyone to read review images
CREATE POLICY "Public Access for review-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-images');

-- Allow authenticated users to upload review images
CREATE POLICY "Authenticated users can upload review images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'review-images');

-- Allow users to update their own review images
CREATE POLICY "Users can update their own review images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'review-images' AND auth.uid() = owner);

-- Allow users to delete their own review images
CREATE POLICY "Users can delete their own review images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'review-images' AND auth.uid() = owner);

-- Set up RLS policies for user-avatars bucket
-- Allow anyone to read user avatars
CREATE POLICY "Public Access for user-avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-avatars');

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'user-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'user-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'user-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Set up RLS policies for gift-box-images bucket
-- Allow anyone to read gift box images
CREATE POLICY "Public Access for gift-box-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gift-box-images');

-- Allow authenticated users to upload gift box images
CREATE POLICY "Authenticated users can upload gift box images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gift-box-images');

-- Allow users to update their own gift box images
CREATE POLICY "Users can update their own gift box images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gift-box-images' AND auth.uid() = owner);

-- Allow users to delete their own gift box images
CREATE POLICY "Users can delete their own gift box images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gift-box-images' AND auth.uid() = owner);

-- Set up RLS policies for recipe-images bucket
-- Allow anyone to read recipe images
CREATE POLICY "Public Access for recipe-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'recipe-images');

-- Allow authenticated users to upload recipe images
CREATE POLICY "Authenticated users can upload recipe images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'recipe-images');

-- Allow users to update their own recipe images
CREATE POLICY "Users can update their own recipe images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'recipe-images' AND auth.uid() = owner);

-- Allow users to delete their own recipe images
CREATE POLICY "Users can delete their own recipe images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'recipe-images' AND auth.uid() = owner);

-- Set up RLS policies for category-images bucket
-- Allow anyone to read category images
CREATE POLICY "Public Access for category-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'category-images');

-- Allow authenticated users to upload category images
CREATE POLICY "Authenticated users can upload category images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'category-images');

-- Allow users to update their own category images
CREATE POLICY "Users can update their own category images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'category-images' AND auth.uid() = owner);

-- Allow users to delete their own category images
CREATE POLICY "Users can delete their own category images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'category-images' AND auth.uid() = owner);

-- Set up RLS policies for banner-images bucket
-- Allow anyone to read banner images
CREATE POLICY "Public Access for banner-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banner-images');

-- Allow authenticated users to upload banner images
CREATE POLICY "Authenticated users can upload banner images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'banner-images');

-- Allow users to update their own banner images
CREATE POLICY "Users can update their own banner images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'banner-images' AND auth.uid() = owner);

-- Allow users to delete their own banner images
CREATE POLICY "Users can delete their own banner images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'banner-images' AND auth.uid() = owner);

-- Set up RLS policies for blog-images bucket
-- Allow anyone to read blog images
CREATE POLICY "Public Access for blog-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Allow authenticated users to upload blog images
CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

-- Allow users to update their own blog images
CREATE POLICY "Users can update their own blog images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images' AND auth.uid() = owner);

-- Allow users to delete their own blog images
CREATE POLICY "Users can delete their own blog images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images' AND auth.uid() = owner);

-- Set up RLS policies for about-images bucket
-- Allow anyone to read about images
CREATE POLICY "Public Access for about-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'about-images');

-- Allow authenticated users to upload about images
CREATE POLICY "Authenticated users can upload about images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'about-images');

-- Allow users to update their own about images
CREATE POLICY "Users can update their own about images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'about-images' AND auth.uid() = owner);

-- Allow users to delete their own about images
CREATE POLICY "Users can delete their own about images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'about-images' AND auth.uid() = owner);
