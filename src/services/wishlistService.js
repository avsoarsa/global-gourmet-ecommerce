/**
 * Wishlist Service
 * Handles all wishlist-related API calls
 */

import { supabase } from '../utils/supabaseClient';

/**
 * Get the user's wishlist
 * @returns {Promise<Array>} - Array of wishlist items with product details
 */
export const getWishlist = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { items: [] };
    }

    // Get the wishlist items with product details
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        products (
          *,
          product_images (*),
          product_variants (*),
          product_categories (*)
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }

    // Format the response to match the expected structure
    const formattedItems = data.map(item => ({
      id: item.id,
      productId: item.product_id,
      product: {
        id: item.products.id,
        name: item.products.name,
        slug: item.products.slug,
        description: item.products.description,
        shortDescription: item.products.short_description,
        price: item.products.price,
        originalPrice: item.products.compare_at_price,
        discount: item.products.discount_percentage,
        image: item.products.product_images[0]?.image_url || '',
        rating: item.products.rating,
        reviews: item.products.review_count,
        inStock: item.products.stock_quantity > 0,
        featured: item.products.is_featured,
        bestseller: item.products.is_bestseller,
        organic: item.products.is_organic,
        category: item.products.product_categories.name,
        categorySlug: item.products.product_categories.slug,
        weightOptions: item.products.product_variants.map(variant => ({
          weight: variant.weight,
          price: variant.price,
          originalPrice: variant.compare_at_price,
          inStock: variant.stock_quantity > 0
        }))
      },
      addedAt: item.created_at
    }));

    return { items: formattedItems };
  } catch (error) {
    console.error('Error in getWishlist:', error);
    throw error;
  }
};

/**
 * Add a product to the wishlist
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} - Added wishlist item
 */
export const addToWishlist = async (productId) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to add items to your wishlist');
    }

    // Check if the product is already in the wishlist
    const { data: existingItem } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      return { id: existingItem.id, productId };
    }

    // Add the product to the wishlist
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: user.id,
        product_id: productId
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }

    return { id: data.id, productId: data.product_id };
  } catch (error) {
    console.error('Error in addToWishlist:', error);
    throw error;
  }
};

/**
 * Remove a product from the wishlist
 * @param {string} productId - Product ID
 * @returns {Promise<void>}
 */
export const removeFromWishlist = async (productId) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to remove items from your wishlist');
    }

    // Remove the product from the wishlist
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in removeFromWishlist:', error);
    throw error;
  }
};

/**
 * Check if a product is in the wishlist
 * @param {string} productId - Product ID
 * @returns {Promise<boolean>} - True if the product is in the wishlist
 */
export const isInWishlist = async (productId) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    // Check if the product is in the wishlist
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
      console.error('Error checking wishlist:', error);
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isInWishlist:', error);
    throw error;
  }
};

/**
 * Clear the wishlist
 * @returns {Promise<void>}
 */
export const clearWishlist = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to clear your wishlist');
    }

    // Clear the wishlist
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in clearWishlist:', error);
    throw error;
  }
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist
};
