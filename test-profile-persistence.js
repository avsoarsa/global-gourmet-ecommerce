// Test script to verify profile data persistence
import { supabase } from './src/utils/supabaseClient';

// Function to test user profile persistence
async function testProfilePersistence() {
  try {
    console.log('Testing profile data persistence...');
    
    // 1. Sign in with test credentials
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    });
    
    if (signInError) {
      throw new Error(`Sign in error: ${signInError.message}`);
    }
    
    console.log('Signed in successfully');
    
    // 2. Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw new Error(`Get user error: ${userError.message}`);
    }
    
    if (!user) {
      throw new Error('No user found after sign in');
    }
    
    console.log('User ID:', user.id);
    
    // 3. Get user profile from user_profiles table
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      throw new Error(`Get profile error: ${profileError.message}`);
    }
    
    console.log('User profile:', userProfile || 'No profile found');
    
    // 4. Update user profile
    const testData = {
      phone: '123-456-7890',
      birthdate: '1990-01-01',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        newsletterSubscription: true
      }
    };
    
    if (userProfile) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(testData)
        .eq('user_id', user.id);
      
      if (updateError) {
        throw new Error(`Update profile error: ${updateError.message}`);
      }
      
      console.log('Updated existing profile');
    } else {
      // Create new profile
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          ...testData
        });
      
      if (insertError) {
        throw new Error(`Insert profile error: ${insertError.message}`);
      }
      
      console.log('Created new profile');
    }
    
    // 5. Sign out
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      throw new Error(`Sign out error: ${signOutError.message}`);
    }
    
    console.log('Signed out successfully');
    
    // 6. Sign in again
    const { data: signInAgainData, error: signInAgainError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    });
    
    if (signInAgainError) {
      throw new Error(`Sign in again error: ${signInAgainError.message}`);
    }
    
    console.log('Signed in again successfully');
    
    // 7. Get user profile again
    const { data: { user: userAgain }, error: userAgainError } = await supabase.auth.getUser();
    
    if (userAgainError) {
      throw new Error(`Get user again error: ${userAgainError.message}`);
    }
    
    if (!userAgain) {
      throw new Error('No user found after second sign in');
    }
    
    const { data: userProfileAgain, error: profileAgainError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userAgain.id)
      .single();
    
    if (profileAgainError) {
      throw new Error(`Get profile again error: ${profileAgainError.message}`);
    }
    
    console.log('User profile after signing in again:', userProfileAgain);
    
    // 8. Verify that the profile data persisted
    if (!userProfileAgain) {
      throw new Error('Profile data did not persist');
    }
    
    if (userProfileAgain.phone !== testData.phone) {
      throw new Error(`Phone number did not persist. Expected: ${testData.phone}, Got: ${userProfileAgain.phone}`);
    }
    
    if (userProfileAgain.birthdate !== testData.birthdate) {
      throw new Error(`Birthdate did not persist. Expected: ${testData.birthdate}, Got: ${userProfileAgain.birthdate}`);
    }
    
    console.log('Profile data persisted successfully!');
    
    // 9. Sign out again
    await supabase.auth.signOut();
    console.log('Test completed successfully');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testProfilePersistence();
