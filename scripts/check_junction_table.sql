-- Check if product_categories_junction table exists and create it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'product_categories_junction'
  ) THEN
    CREATE TABLE product_categories_junction (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(product_id, category_id)
    );
    
    -- Add RLS policies
    ALTER TABLE product_categories_junction ENABLE ROW LEVEL SECURITY;
    
    -- Allow public read access
    CREATE POLICY "Allow public read access" ON product_categories_junction FOR SELECT USING (true);
    
    -- Allow admin full access
    CREATE POLICY "Allow admin full access" ON product_categories_junction FOR ALL USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = auth.uid()
      )
    );
    
    RAISE NOTICE 'Created product_categories_junction table';
  ELSE
    RAISE NOTICE 'product_categories_junction table already exists';
  END IF;
END $$;
