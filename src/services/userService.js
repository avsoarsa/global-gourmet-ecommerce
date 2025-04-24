/**
 * User Service
 * Handles all user-related API calls
 */

import { supabase } from '../utils/supabaseClient';

/**
 * Get the current user's profile
 * @returns {Promise<Object>} - User profile
 */
export const getUserProfile = async () => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      return null;
    }

    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
      console.error('Error fetching user profile:', profileError);
      throw profileError;
    }

    // Get user metadata from auth
    const { data: userData } = await supabase.auth.admin.getUserById(user.id);

    // Format the response
    return {
      id: user.id,
      email: user.email,
      firstName: userData?.user?.user_metadata?.first_name || '',
      lastName: userData?.user?.user_metadata?.last_name || '',
      phone: profile?.phone || '',
      birthdate: profile?.birthdate || '',
      preferences: profile?.preferences || {
        emailNotifications: true,
        smsNotifications: false,
        newsletterSubscription: true
      },
      createdAt: user.created_at
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

/**
 * Update the current user's profile
 * @param {Object} profile - Profile data to update
 * @returns {Promise<Object>} - Updated user profile
 */
export const updateUserProfile = async (profile) => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      throw new Error('You must be logged in to update your profile');
    }

    // Update user metadata in auth
    const { error: updateAuthError } = await supabase.auth.updateUser({
      data: {
        first_name: profile.firstName,
        last_name: profile.lastName
      }
    });

    if (updateAuthError) {
      console.error('Error updating user metadata:', updateAuthError);
      throw updateAuthError;
    }

    // Check if the user has a profile
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking user profile:', checkError);
      throw checkError;
    }

    let profileData;

    if (existingProfile) {
      // Update the existing profile
      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          phone: profile.phone,
          birthdate: profile.birthdate,
          preferences: profile.preferences
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        throw updateError;
      }

      profileData = data;
    } else {
      // Create a new profile
      const { data, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          phone: profile.phone,
          birthdate: profile.birthdate,
          preferences: profile.preferences
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        throw insertError;
      }

      profileData = data;
    }

    // Return the updated profile
    return {
      id: user.id,
      email: user.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profileData.phone,
      birthdate: profileData.birthdate,
      preferences: profileData.preferences,
      createdAt: user.created_at
    };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

/**
 * Get the user's addresses
 * @returns {Promise<Array>} - Array of addresses
 */
export const getUserAddresses = async () => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      return { addresses: [] };
    }

    // Get the user's addresses
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error fetching user addresses:', error);
      throw error;
    }

    // Format the response
    const formattedAddresses = data.map(address => ({
      id: address.id,
      addressType: address.address_type,
      isDefault: address.is_default,
      firstName: address.first_name,
      lastName: address.last_name,
      company: address.company,
      street: address.address_line1,
      street2: address.address_line2,
      city: address.city,
      state: address.state,
      zipCode: address.postal_code,
      country: address.country,
      phone: address.phone,
      deliveryInstructions: address.delivery_instructions
    }));

    return { addresses: formattedAddresses };
  } catch (error) {
    console.error('Error in getUserAddresses:', error);
    throw error;
  }
};

/**
 * Add a new address
 * @param {Object} address - Address data
 * @returns {Promise<Object>} - Added address
 */
export const addAddress = async (address) => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      throw new Error('You must be logged in to add an address');
    }

    // If this is the default address, unset any existing default addresses
    if (address.isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('address_type', address.addressType);
    }

    // Add the address
    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        address_type: address.addressType,
        is_default: address.isDefault,
        first_name: address.firstName,
        last_name: address.lastName,
        company: address.company,
        address_line1: address.street,
        address_line2: address.street2,
        city: address.city,
        state: address.state,
        postal_code: address.zipCode,
        country: address.country,
        phone: address.phone,
        delivery_instructions: address.deliveryInstructions
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding address:', error);
      throw error;
    }

    // Format the response
    return {
      id: data.id,
      addressType: data.address_type,
      isDefault: data.is_default,
      firstName: data.first_name,
      lastName: data.last_name,
      company: data.company,
      street: data.address_line1,
      street2: data.address_line2,
      city: data.city,
      state: data.state,
      zipCode: data.postal_code,
      country: data.country,
      phone: data.phone,
      deliveryInstructions: data.delivery_instructions
    };
  } catch (error) {
    console.error('Error in addAddress:', error);
    throw error;
  }
};

/**
 * Update an address
 * @param {string} addressId - Address ID
 * @param {Object} address - Address data
 * @returns {Promise<Object>} - Updated address
 */
export const updateAddress = async (addressId, address) => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      throw new Error('You must be logged in to update an address');
    }

    // If this is the default address, unset any existing default addresses
    if (address.isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('address_type', address.addressType)
        .neq('id', addressId);
    }

    // Update the address
    const { data, error } = await supabase
      .from('addresses')
      .update({
        address_type: address.addressType,
        is_default: address.isDefault,
        first_name: address.firstName,
        last_name: address.lastName,
        company: address.company,
        address_line1: address.street,
        address_line2: address.street2,
        city: address.city,
        state: address.state,
        postal_code: address.zipCode,
        country: address.country,
        phone: address.phone,
        delivery_instructions: address.deliveryInstructions
      })
      .eq('id', addressId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating address:', error);
      throw error;
    }

    // Format the response
    return {
      id: data.id,
      addressType: data.address_type,
      isDefault: data.is_default,
      firstName: data.first_name,
      lastName: data.last_name,
      company: data.company,
      street: data.address_line1,
      street2: data.address_line2,
      city: data.city,
      state: data.state,
      zipCode: data.postal_code,
      country: data.country,
      phone: data.phone,
      deliveryInstructions: data.delivery_instructions
    };
  } catch (error) {
    console.error('Error in updateAddress:', error);
    throw error;
  }
};

/**
 * Delete an address
 * @param {string} addressId - Address ID
 * @returns {Promise<void>}
 */
export const deleteAddress = async (addressId) => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      throw new Error('You must be logged in to delete an address');
    }

    // Delete the address
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteAddress:', error);
    throw error;
  }
};

/**
 * Get the user's orders
 * @returns {Promise<Array>} - Array of orders
 */
export const getUserOrders = async () => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      return { orders: [] };
    }

    // Get the user's orders
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            *,
            product_images (*)
          ),
          product_variants (*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }

    // Format the response
    const formattedOrders = data.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      date: order.created_at,
      total: order.total_amount,
      items: order.order_items.map(item => ({
        id: item.id,
        productId: item.product_id,
        product: {
          id: item.products.id,
          name: item.products.name,
          slug: item.products.slug,
          image: item.products.product_images[0]?.image_url || ''
        },
        variant: item.product_variants ? {
          weight: item.product_variants.weight
        } : null,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }))
    }));

    return { orders: formattedOrders };
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    throw error;
  }
};

/**
 * Get an order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} - Order details
 */
export const getOrderById = async (orderId) => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      throw new Error('You must be logged in to view order details');
    }

    // Get the order
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            *,
            product_images (*)
          ),
          product_variants (*)
        ),
        addresses!shipping_address_id (*)
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }

    // Format the response
    return {
      id: data.id,
      orderNumber: data.order_number,
      status: data.status,
      date: data.created_at,
      subtotal: data.subtotal,
      shipping: data.shipping_cost,
      tax: data.tax_amount,
      discount: data.discount_amount,
      total: data.total_amount,
      currency: data.currency,
      paymentMethod: data.payment_method,
      paymentStatus: data.payment_status,
      shippingMethod: data.shipping_method,
      trackingNumber: data.tracking_number,
      notes: data.notes,
      giftMessage: data.gift_message,
      isGift: data.is_gift,
      shippingAddress: data.addresses ? {
        firstName: data.addresses.first_name,
        lastName: data.addresses.last_name,
        company: data.addresses.company,
        street: data.addresses.address_line1,
        street2: data.addresses.address_line2,
        city: data.addresses.city,
        state: data.addresses.state,
        zipCode: data.addresses.postal_code,
        country: data.addresses.country,
        phone: data.addresses.phone
      } : null,
      items: data.order_items.map(item => ({
        id: item.id,
        productId: item.product_id,
        product: {
          id: item.products.id,
          name: item.products.name,
          slug: item.products.slug,
          image: item.products.product_images[0]?.image_url || ''
        },
        variant: item.product_variants ? {
          weight: item.product_variants.weight
        } : null,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }))
    };
  } catch (error) {
    console.error('Error in getOrderById:', error);
    throw error;
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getUserOrders,
  getOrderById
};
