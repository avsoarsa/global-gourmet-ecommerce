-- Add RLS policies to user_profiles table

-- Enable RLS for user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own profile
CREATE POLICY "Allow users to view their own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Allow users to update their own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Allow users to insert their own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow admins full access
CREATE POLICY "Allow admin full access"
ON user_profiles FOR ALL
USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);
