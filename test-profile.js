// Simple test script to check if the user_profiles table exists in Supabase
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lxljeehmdzrvxwaqlmhf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bGplZWhtZHpydnh3YXFsbWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NDQzOTksImV4cCI6MjA2MTAyMDM5OX0.gU4LoXQ0ETWS-vD3aQMubgeYKwqcFVzzb3r6LTaNNJQ';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to check if the user_profiles table exists
async function checkUserProfilesTable() {
  try {
    console.log('Checking if user_profiles table exists...');
    
    // Get the list of tables
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error:', error.message);
      return;
    }
    
    console.log('user_profiles table exists!');
    console.log('Sample data:', data);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the test
checkUserProfilesTable();
