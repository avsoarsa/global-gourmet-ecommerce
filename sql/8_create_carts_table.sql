-- Create carts table for storing user shopping carts

-- Carts Table
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS carts_user_id_idx ON carts (user_id);

-- Enable Row Level Security
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow users to view their own cart" ON carts FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY "Allow users to update their own cart" ON carts FOR UPDATE USING (
  auth.uid() = user_id
);

CREATE POLICY "Allow users to insert their own cart" ON carts FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Allow users to delete their own cart" ON carts FOR DELETE USING (
  auth.uid() = user_id
);

CREATE POLICY "Allow admin full access" ON carts FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_carts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_carts_updated_at
BEFORE UPDATE ON carts
FOR EACH ROW
EXECUTE FUNCTION update_carts_updated_at();
