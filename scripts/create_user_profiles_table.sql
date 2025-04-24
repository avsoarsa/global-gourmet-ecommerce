-- SQL function to create the user_profiles table in Supabase

CREATE OR REPLACE FUNCTION create_user_profiles_table()
RETURNS void AS $$
BEGIN
  -- Create the user_profiles table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT,
    birthdate DATE,
    preferences JSONB DEFAULT '{"emailNotifications": true, "smsNotifications": false, "newsletterSubscription": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create index on user_id for faster lookups
  CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

  -- Create RLS policies for the user_profiles table
  -- Allow users to select their own profile
  DROP POLICY IF EXISTS select_own_profile ON public.user_profiles;
  CREATE POLICY select_own_profile ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

  -- Allow users to insert their own profile
  DROP POLICY IF EXISTS insert_own_profile ON public.user_profiles;
  CREATE POLICY insert_own_profile ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  -- Allow users to update their own profile
  DROP POLICY IF EXISTS update_own_profile ON public.user_profiles;
  CREATE POLICY update_own_profile ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

  -- Enable RLS on the user_profiles table
  ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

  -- Grant access to authenticated users
  GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;

  -- Create function to update the updated_at timestamp
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Create trigger to update the updated_at timestamp
  DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
  CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;
