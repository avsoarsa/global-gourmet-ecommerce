/**
 * Gift Box Service
 * Handles all gift box-related API calls to Supabase
 */

import { supabase } from '../utils/supabaseClient';

/**
 * Get all gift box templates
 * @returns {Promise<Array>} - List of gift box templates
 */
export const getGiftBoxTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('gift_box_templates')
      .select('*')
      .eq('is_active', true)
      .order('base_price', { ascending: true });

    if (error) {
      console.error('Error fetching gift box templates:', error);
      throw error;
    }

    // Format the response to match the expected structure in the frontend
    const formattedTemplates = data.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      image: template.image_url,
      basePrice: template.base_price
    }));

    return formattedTemplates;
  } catch (error) {
    console.error('Error in getGiftBoxTemplates:', error);
    throw error;
  }
};

/**
 * Get a gift box template by ID
 * @param {string} templateId - Template ID
 * @returns {Promise<Object>} - Gift box template details
 */
export const getGiftBoxTemplateById = async (templateId) => {
  try {
    const { data, error } = await supabase
      .from('gift_box_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) {
      console.error('Error fetching gift box template:', error);
      throw error;
    }

    // Format the response to match the expected structure in the frontend
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image_url,
      basePrice: data.base_price
    };
  } catch (error) {
    console.error('Error in getGiftBoxTemplateById:', error);
    throw error;
  }
};

/**
 * Create a new gift box
 * @param {Object} giftBox - Gift box data
 * @returns {Promise<Object>} - Created gift box
 */
export const createGiftBox = async (giftBox) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Generate a session ID for non-authenticated users
    const sessionId = !user ? `session_${Date.now()}` : null;
    
    // Create the gift box
    const { data, error } = await supabase
      .from('gift_boxes')
      .insert({
        user_id: user?.id || null,
        session_id: sessionId,
        template_id: giftBox.templateId,
        name: giftBox.name,
        message: giftBox.message,
        total_price: giftBox.totalPrice
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating gift box:', error);
      throw error;
    }

    // Add gift box items
    if (giftBox.items && giftBox.items.length > 0) {
      const itemPromises = giftBox.items.map(item => {
        return supabase
          .from('gift_box_items')
          .insert({
            gift_box_id: data.id,
            product_id: item.productId,
            product_variant_id: item.variantId,
            quantity: item.quantity,
            price: item.price
          });
      });

      await Promise.all(itemPromises);
    }

    // Return the created gift box
    return {
      id: data.id,
      templateId: data.template_id,
      name: data.name,
      message: data.message,
      totalPrice: data.total_price,
      items: giftBox.items || []
    };
  } catch (error) {
    console.error('Error in createGiftBox:', error);
    throw error;
  }
};

/**
 * Get a gift box by ID
 * @param {string} giftBoxId - Gift box ID
 * @returns {Promise<Object>} - Gift box details
 */
export const getGiftBoxById = async (giftBoxId) => {
  try {
    // Get the gift box
    const { data, error } = await supabase
      .from('gift_boxes')
      .select(`
        *,
        template:gift_box_templates (*),
        items:gift_box_items (
          *,
          product:products (*),
          variant:product_variants (*)
        )
      `)
      .eq('id', giftBoxId)
      .single();

    if (error) {
      console.error('Error fetching gift box:', error);
      throw error;
    }

    // Format the response to match the expected structure in the frontend
    return {
      id: data.id,
      templateId: data.template_id,
      template: {
        id: data.template.id,
        name: data.template.name,
        description: data.template.description,
        image: data.template.image_url,
        basePrice: data.template.base_price
      },
      name: data.name,
      message: data.message,
      totalPrice: data.total_price,
      items: data.items.map(item => ({
        id: item.id,
        productId: item.product_id,
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.product_images?.[0]?.image_url || '',
          price: item.product.price
        },
        variantId: item.product_variant_id,
        variant: item.variant ? {
          id: item.variant.id,
          name: item.variant.name,
          weight: item.variant.weight,
          price: item.variant.price
        } : null,
        quantity: item.quantity,
        price: item.price
      }))
    };
  } catch (error) {
    console.error('Error in getGiftBoxById:', error);
    throw error;
  }
};

/**
 * Update a gift box
 * @param {string} giftBoxId - Gift box ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} - Updated gift box
 */
export const updateGiftBox = async (giftBoxId, updates) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get the current gift box to check ownership
    const { data: currentGiftBox, error: fetchError } = await supabase
      .from('gift_boxes')
      .select('user_id, session_id')
      .eq('id', giftBoxId)
      .single();

    if (fetchError) {
      console.error('Error fetching gift box for update:', fetchError);
      throw fetchError;
    }

    // Check ownership
    if (currentGiftBox.user_id && currentGiftBox.user_id !== user?.id) {
      throw new Error('You do not have permission to update this gift box');
    }

    // Update the gift box
    const { data, error } = await supabase
      .from('gift_boxes')
      .update({
        name: updates.name,
        message: updates.message,
        total_price: updates.totalPrice
      })
      .eq('id', giftBoxId)
      .select()
      .single();

    if (error) {
      console.error('Error updating gift box:', error);
      throw error;
    }

    // Update gift box items if provided
    if (updates.items) {
      // First, delete all existing items
      await supabase
        .from('gift_box_items')
        .delete()
        .eq('gift_box_id', giftBoxId);

      // Then, add the new items
      const itemPromises = updates.items.map(item => {
        return supabase
          .from('gift_box_items')
          .insert({
            gift_box_id: giftBoxId,
            product_id: item.productId,
            product_variant_id: item.variantId,
            quantity: item.quantity,
            price: item.price
          });
      });

      await Promise.all(itemPromises);
    }

    // Return the updated gift box
    return {
      id: data.id,
      templateId: data.template_id,
      name: data.name,
      message: data.message,
      totalPrice: data.total_price,
      items: updates.items || []
    };
  } catch (error) {
    console.error('Error in updateGiftBox:', error);
    throw error;
  }
};

/**
 * Delete a gift box
 * @param {string} giftBoxId - Gift box ID
 * @returns {Promise<void>}
 */
export const deleteGiftBox = async (giftBoxId) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get the current gift box to check ownership
    const { data: currentGiftBox, error: fetchError } = await supabase
      .from('gift_boxes')
      .select('user_id, session_id')
      .eq('id', giftBoxId)
      .single();

    if (fetchError) {
      console.error('Error fetching gift box for deletion:', fetchError);
      throw fetchError;
    }

    // Check ownership
    if (currentGiftBox.user_id && currentGiftBox.user_id !== user?.id) {
      throw new Error('You do not have permission to delete this gift box');
    }

    // Delete the gift box (cascade will delete items)
    const { error } = await supabase
      .from('gift_boxes')
      .delete()
      .eq('id', giftBoxId);

    if (error) {
      console.error('Error deleting gift box:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteGiftBox:', error);
    throw error;
  }
};

/**
 * Get user's gift boxes
 * @returns {Promise<Array>} - List of user's gift boxes
 */
export const getUserGiftBoxes = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    // Get the user's gift boxes
    const { data, error } = await supabase
      .from('gift_boxes')
      .select(`
        *,
        template:gift_box_templates (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user gift boxes:', error);
      throw error;
    }

    // Format the response to match the expected structure in the frontend
    return data.map(giftBox => ({
      id: giftBox.id,
      templateId: giftBox.template_id,
      template: {
        id: giftBox.template.id,
        name: giftBox.template.name,
        image: giftBox.template.image_url
      },
      name: giftBox.name,
      totalPrice: giftBox.total_price,
      createdAt: giftBox.created_at
    }));
  } catch (error) {
    console.error('Error in getUserGiftBoxes:', error);
    throw error;
  }
};

export default {
  getGiftBoxTemplates,
  getGiftBoxTemplateById,
  createGiftBox,
  getGiftBoxById,
  updateGiftBox,
  deleteGiftBox,
  getUserGiftBoxes
};
