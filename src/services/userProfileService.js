import { supabase } from '../utils/supabaseClient';
import { uploadUserAvatar, deleteUserAvatar } from './imageService';

/**
 * Get the current user's profile
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getUserProfile = async () => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw profileError;
    }

    // If profile doesn't exist, create one
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userData.user.id,
          first_name: userData.user.user_metadata?.first_name || '',
          last_name: userData.user.user_metadata?.last_name || '',
          phone: userData.user.user_metadata?.phone || '',
          created_at: new Date(),
          updated_at: new Date()
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      return {
        success: true,
        data: {
          ...newProfile,
          email: userData.user.email
        }
      };
    }

    return {
      success: true,
      data: {
        ...profile,
        email: userData.user.email
      }
    };
  } catch (error) {
    console.error('Get user profile error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update the current user's profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const updateUserProfile = async (profileData) => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // Update user metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone: profileData.phone
      }
    });

    if (metadataError) {
      throw metadataError;
    }

    // Update user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userData.user.id,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone: profileData.phone,
        birthdate: profileData.birthdate,
        bio: profileData.bio,
        preferences: profileData.preferences,
        updated_at: new Date()
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    return {
      success: true,
      data: {
        ...profile,
        email: userData.user.email
      }
    };
  } catch (error) {
    console.error('Update user profile error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update the current user's avatar
 * @param {File} avatarFile - Avatar image file
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const updateUserAvatar = async (avatarFile) => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // Get current profile to check if user already has an avatar
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('avatar_url')
      .eq('user_id', userData.user.id)
      .single();

    // Delete old avatar if exists
    if (profile && profile.avatar_url) {
      await deleteUserAvatar(profile.avatar_url);
    }

    // Upload new avatar
    const { success, data: imageData, error: uploadError } = await uploadUserAvatar(avatarFile, userData.user.id);

    if (!success) {
      throw new Error(uploadError);
    }

    // Update user profile with new avatar URL
    const { data: updatedProfile, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userData.user.id,
        avatar_url: imageData.url,
        updated_at: new Date()
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    return {
      success: true,
      data: {
        ...updatedProfile,
        email: userData.user.email
      }
    };
  } catch (error) {
    console.error('Update user avatar error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get user addresses
 * @returns {Promise<{success: boolean, data?: Object[], error?: string}>}
 */
export const getUserAddresses = async () => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // Get user addresses
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('is_default', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Get user addresses error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Add a new address
 * @param {Object} address - Address data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const addUserAddress = async (address) => {
  try {
    // Validate required fields
    if (!address.address_line1 || !address.city || !address.postal_code || !address.country) {
      throw new Error('Address line 1, city, postal code, and country are required');
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // If this is the first address or is_default is true, make it the default
    let isDefault = address.is_default;
    if (isDefault) {
      // If this address is default, unset default for all other addresses
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userData.user.id);
    } else {
      // Check if user has any addresses
      const { data: existingAddresses, error: countError } = await supabase
        .from('user_addresses')
        .select('id')
        .eq('user_id', userData.user.id);

      if (countError) {
        throw countError;
      }

      // If no addresses exist, make this one default
      if (!existingAddresses || existingAddresses.length === 0) {
        isDefault = true;
      }
    }

    // Add address
    const { data, error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: userData.user.id,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        city: address.city,
        state: address.state || '',
        postal_code: address.postal_code,
        country: address.country,
        phone: address.phone || '',
        is_default: isDefault,
        created_at: new Date(),
        updated_at: new Date()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Add user address error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update an existing address
 * @param {string} addressId - Address ID
 * @param {Object} address - Updated address data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const updateUserAddress = async (addressId, address) => {
  try {
    if (!addressId) {
      throw new Error('Address ID is required');
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // If this address is being set as default, unset default for all other addresses
    if (address.is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userData.user.id);
    }

    // Update address
    const { data, error } = await supabase
      .from('user_addresses')
      .update({
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        city: address.city,
        state: address.state || '',
        postal_code: address.postal_code,
        country: address.country,
        phone: address.phone || '',
        is_default: address.is_default,
        updated_at: new Date()
      })
      .eq('id', addressId)
      .eq('user_id', userData.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Update user address error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete an address
 * @param {string} addressId - Address ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteUserAddress = async (addressId) => {
  try {
    if (!addressId) {
      throw new Error('Address ID is required');
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // Check if this is the default address
    const { data: address } = await supabase
      .from('user_addresses')
      .select('is_default')
      .eq('id', addressId)
      .eq('user_id', userData.user.id)
      .single();

    // Delete address
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', userData.user.id);

    if (error) {
      throw error;
    }

    // If this was the default address, set a new default
    if (address && address.is_default) {
      const { data: addresses } = await supabase
        .from('user_addresses')
        .select('id')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (addresses && addresses.length > 0) {
        await supabase
          .from('user_addresses')
          .update({ is_default: true })
          .eq('id', addresses[0].id);
      }
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Delete user address error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Set an address as default
 * @param {string} addressId - Address ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const setDefaultAddress = async (addressId) => {
  try {
    if (!addressId) {
      throw new Error('Address ID is required');
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // Unset default for all addresses
    await supabase
      .from('user_addresses')
      .update({ is_default: false })
      .eq('user_id', userData.user.id);

    // Set this address as default
    const { data, error } = await supabase
      .from('user_addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', userData.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Set default address error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress
};
