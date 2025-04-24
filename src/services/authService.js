import { supabase } from '../utils/supabaseClient';

/**
 * Sign up a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} phone - User's phone number
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const signUp = async (email, password, firstName, lastName, phone) => {
  try {
    // Validate inputs
    if (!email || !password || !firstName || !lastName) {
      throw new Error('Email, password, first name, and last name are required');
    }

    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || ''
        }
      }
    });

    if (authError) {
      throw authError;
    }

    // Create or update user profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          phone: phone || '',
          created_at: new Date(),
          updated_at: new Date()
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // We don't throw here because the user was created successfully
      }
    }

    return {
      success: true,
      data: authData
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Sign in a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const signIn = async (email, password) => {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Sign in the user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Sign in a user with Google OAuth
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Google sign in error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Sign out the current user
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send a password reset email
 * @param {string} email - User's email
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const resetPassword = async (email) => {
  try {
    // Validate input
    if (!email) {
      throw new Error('Email is required');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      throw error;
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updatePassword = async (newPassword) => {
  try {
    // Validate input
    if (!newPassword) {
      throw new Error('New password is required');
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Update password error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get the current user session
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Get session error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get the current user
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data.user
    };
  } catch (error) {
    console.error('Get user error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update user profile
 * @param {Object} profile - User profile data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const updateProfile = async (profile) => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // Update auth metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone
      }
    });

    if (metadataError) {
      throw metadataError;
    }

    // Update user profile in database
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userData.user.id,
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
        birthdate: profile.birthdate,
        preferences: profile.preferences,
        updated_at: new Date()
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    return {
      success: true,
      data: profileData
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get user profile
 * @param {string} userId - User ID (optional, defaults to current user)
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getProfile = async (userId) => {
  try {
    let userIdToUse = userId;

    // If no userId provided, get current user
    if (!userIdToUse) {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!userData.user) {
        throw new Error('No authenticated user found');
      }

      userIdToUse = userData.user.id;
    }

    // Get user profile from database
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userIdToUse)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw profileError;
    }

    // Get user data from auth
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('id', userIdToUse)
      .single();

    if (userError) {
      throw userError;
    }

    // Combine profile and user data
    const combinedProfile = {
      ...profileData,
      email: userData?.email,
      phone: profileData?.phone || userData?.phone,
      firstName: profileData?.first_name,
      lastName: profileData?.last_name
    };

    return {
      success: true,
      data: combinedProfile
    };
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  signUp,
  signIn,
  signInWithGoogle,
  signOut,
  resetPassword,
  updatePassword,
  getCurrentSession,
  getCurrentUser,
  updateProfile,
  getProfile
};
