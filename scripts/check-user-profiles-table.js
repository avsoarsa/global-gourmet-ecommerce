// Script to check if the user_profiles table exists in Supabase
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lxljeehmdzrvxwaqlmhf.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'your-service-key-here';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to check if the user_profiles table exists
async function checkUserProfilesTable() {
  try {
    console.log('Checking if user_profiles table exists...');
    
    // Try to query the user_profiles table
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count(*)', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.error('Error querying user_profiles table:', error.message);
      console.log('The user_profiles table might not exist. Creating it...');
      await createUserProfilesTable();
      return;
    }
    
    console.log('user_profiles table exists!');
    console.log(`Total records: ${data.count || 0}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Function to create the user_profiles table
async function createUserProfilesTable() {
  try {
    // Create the user_profiles table
    const { error } = await supabase.rpc('create_user_profiles_table');
    
    if (error) {
      console.error('Error creating user_profiles table:', error.message);
      return;
    }
    
    console.log('user_profiles table created successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the check
checkUserProfilesTable();
