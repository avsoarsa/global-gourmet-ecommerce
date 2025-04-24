/**
 * Cart Service
 * Handles all cart-related operations
 *
 * Note: Cart data is stored in localStorage for non-authenticated users
 * and synced with Supabase for authenticated users
 */

import { supabase } from '../utils/supabaseClient';
import { memoize, selectFields } from '../utils/performanceUtils';
import { handleApiError, validateRequiredFields } from '../utils/errorHandler';

// Local storage key for cart
const CART_STORAGE_KEY = 'global_gourmet_cart';

/**
 * Get the current cart
 * @returns {Promise<Object>} - Cart object with items and totals
 */
export const getCart = async () => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Get cart from Supabase
      const result = await getCartFromSupabase(user.id);

      // Check if result is an error response
      if (result && !result.success && result.error) {
        console.warn('Error getting cart from Supabase, falling back to localStorage:', result.error);
        return {
          success: true,
          data: getCartFromLocalStorage()
        };
      }

      return {
        success: true,
        data: result
      };
    } else {
      // Get cart from localStorage
      return {
        success: true,
        data: getCartFromLocalStorage()
      };
    }
  } catch (error) {
    // Fallback to localStorage if there's an error
    return {
      success: true,
      data: getCartFromLocalStorage(),
      warning: 'Using local cart due to error fetching remote cart'
    };
  }
};

/**
 * Add an item to the cart
 * @param {Object} item - Item to add to cart
 * @returns {Promise<Object>} - Updated cart
 */
export const addToCart = async (item) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      {
        productId: item.product_id,
        quantity: item.quantity
      },
      ['productId', 'quantity']
    );

    if (validationError) {
      return validationError;
    }

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Add item to Supabase cart
      const result = await addToCartInSupabase(user.id, item);

      // Check if result is an error response
      if (result && !result.success && result.error) {
        console.warn('Error adding to Supabase cart, falling back to localStorage:', result.error);
        return {
          success: true,
          data: addToCartInLocalStorage(item),
          warning: 'Using local cart due to error with remote cart'
        };
      }

      return {
        success: true,
        data: result
      };
    } else {
      // Add item to localStorage cart
      return {
        success: true,
        data: addToCartInLocalStorage(item)
      };
    }
  } catch (error) {
    // Fallback to localStorage if there's an error
    return {
      success: true,
      data: addToCartInLocalStorage(item),
      warning: 'Using local cart due to error with remote cart'
    };
  }
};

/**
 * Update an item in the cart
 * @param {string} itemId - ID of the item to update
 * @param {Object} updates - Updates to apply to the item
 * @returns {Promise<Object>} - Updated cart
 */
export const updateCartItem = async (itemId, updates) => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Update item in Supabase cart
      return await updateCartItemInSupabase(user.id, itemId, updates);
    } else {
      // Update item in localStorage cart
      return updateCartItemInLocalStorage(itemId, updates);
    }
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    // Fallback to localStorage if there's an error
    return updateCartItemInLocalStorage(itemId, updates);
  }
};

/**
 * Remove an item from the cart
 * @param {string} itemId - ID of the item to remove
 * @returns {Promise<Object>} - Updated cart
 */
export const removeFromCart = async (itemId) => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Remove item from Supabase cart
      return await removeFromCartInSupabase(user.id, itemId);
    } else {
      // Remove item from localStorage cart
      return removeFromCartInLocalStorage(itemId);
    }
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    // Fallback to localStorage if there's an error
    return removeFromCartInLocalStorage(itemId);
  }
};

/**
 * Clear the cart
 * @returns {Promise<Object>} - Empty cart
 */
export const clearCart = async () => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Clear Supabase cart
      return await clearCartInSupabase(user.id);
    } else {
      // Clear localStorage cart
      return clearCartInLocalStorage();
    }
  } catch (error) {
    console.error('Error in clearCart:', error);
    // Fallback to localStorage if there's an error
    return clearCartInLocalStorage();
  }
};

/**
 * Sync the cart between localStorage and Supabase
 * This is called when a user logs in or out
 * @returns {Promise<Object>} - Synced cart
 */
export const syncCart = async () => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // User is logged in, merge localStorage cart with Supabase cart
      const localCart = getCartFromLocalStorage();
      const supabaseCart = await getCartFromSupabase(user.id);

      // Merge carts (prefer Supabase cart for duplicates)
      const mergedItems = [...localCart.items];

      for (const supabaseItem of supabaseCart.items) {
        const existingItemIndex = mergedItems.findIndex(
          item => item.productId === supabaseItem.productId && item.variantId === supabaseItem.variantId
        );

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          mergedItems[existingItemIndex].quantity += supabaseItem.quantity;
        } else {
          // Add item if it doesn't exist
          mergedItems.push(supabaseItem);
        }
      }

      // Clear localStorage cart
      clearCartInLocalStorage();

      // Update Supabase cart with merged items
      const cart = {
        items: mergedItems,
        subtotal: calculateSubtotal(mergedItems),
        itemCount: calculateItemCount(mergedItems)
      };

      // Save to Supabase
      await saveCartToSupabase(user.id, cart);

      return cart;
    } else {
      // User is logged out, just return localStorage cart
      return getCartFromLocalStorage();
    }
  } catch (error) {
    console.error('Error in syncCart:', error);
    // Fallback to localStorage if there's an error
    return getCartFromLocalStorage();
  }
};

// Helper functions for localStorage operations

/**
 * Get cart from localStorage
 * @returns {Object} - Cart object
 */
const getCartFromLocalStorage = () => {
  try {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    if (cartJson) {
      return JSON.parse(cartJson);
    }
  } catch (error) {
    console.error('Error getting cart from localStorage:', error);
  }

  // Return empty cart if no cart in localStorage or error
  return {
    items: [],
    subtotal: 0,
    itemCount: 0
  };
};

/**
 * Save cart to localStorage
 * @param {Object} cart - Cart object to save
 */
const saveCartToLocalStorage = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

/**
 * Add item to cart in localStorage
 * @param {Object} item - Item to add
 * @returns {Object} - Updated cart
 */
const addToCartInLocalStorage = (item) => {
  const cart = getCartFromLocalStorage();

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    cartItem => cartItem.productId === item.productId && cartItem.variantId === item.variantId
  );

  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cart.items[existingItemIndex].quantity += item.quantity;
  } else {
    // Add item if it doesn't exist
    cart.items.push({
      id: `${item.productId}_${item.variantId}_${Date.now()}`,
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      image: item.image,
      price: item.price,
      weight: item.weight,
      quantity: item.quantity
    });
  }

  // Update cart totals
  cart.subtotal = calculateSubtotal(cart.items);
  cart.itemCount = calculateItemCount(cart.items);

  // Save to localStorage
  saveCartToLocalStorage(cart);

  return cart;
};

/**
 * Update item in cart in localStorage
 * @param {string} itemId - ID of item to update
 * @param {Object} updates - Updates to apply
 * @returns {Object} - Updated cart
 */
const updateCartItemInLocalStorage = (itemId, updates) => {
  const cart = getCartFromLocalStorage();

  // Find item in cart
  const itemIndex = cart.items.findIndex(item => item.id === itemId);

  if (itemIndex >= 0) {
    // Update item
    cart.items[itemIndex] = {
      ...cart.items[itemIndex],
      ...updates
    };

    // Update cart totals
    cart.subtotal = calculateSubtotal(cart.items);
    cart.itemCount = calculateItemCount(cart.items);

    // Save to localStorage
    saveCartToLocalStorage(cart);
  }

  return cart;
};

/**
 * Remove item from cart in localStorage
 * @param {string} itemId - ID of item to remove
 * @returns {Object} - Updated cart
 */
const removeFromCartInLocalStorage = (itemId) => {
  const cart = getCartFromLocalStorage();

  // Remove item from cart
  cart.items = cart.items.filter(item => item.id !== itemId);

  // Update cart totals
  cart.subtotal = calculateSubtotal(cart.items);
  cart.itemCount = calculateItemCount(cart.items);

  // Save to localStorage
  saveCartToLocalStorage(cart);

  return cart;
};

/**
 * Clear cart in localStorage
 * @returns {Object} - Empty cart
 */
const clearCartInLocalStorage = () => {
  const emptyCart = {
    items: [],
    subtotal: 0,
    itemCount: 0
  };

  // Save to localStorage
  saveCartToLocalStorage(emptyCart);

  return emptyCart;
};

// Helper functions for Supabase operations

/**
 * Get cart from Supabase
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Cart object
 */
const getCartFromSupabase = memoize(async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get cart from Supabase with optimized query
    const { data, error } = await selectFields(
      supabase
        .from('carts')
        .eq('user_id', userId)
        .single(),
      ['id', 'items', 'subtotal', 'item_count']
    );

    if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
      throw error;
    }

    if (data) {
      return {
        id: data.id,
        items: data.items || [],
        subtotal: data.subtotal || 0,
        itemCount: data.item_count || 0
      };
    }
  } catch (error) {
    return handleApiError(error, 'getCartFromSupabase');
  }

  // Return empty cart if no cart in Supabase or error
  return {
    items: [],
    subtotal: 0,
    itemCount: 0
  };
}, userId => userId); // Memoize by userId

/**
 * Save cart to Supabase
 * @param {string} userId - User ID
 * @param {Object} cart - Cart object to save
 * @returns {Promise<Object>} - Saved cart
 */
const saveCartToSupabase = async (userId, cart) => {
  try {
    // Validate required fields
    const validationError = validateRequiredFields(
      { userId, cart },
      ['userId', 'cart']
    );

    if (validationError) {
      return validationError;
    }

    // Check if cart exists using optimized query
    const { data: existingCart } = await selectFields(
      supabase
        .from('carts')
        .eq('user_id', userId)
        .single(),
      ['id']
    );

    const cartData = {
      items: cart.items,
      subtotal: cart.subtotal,
      item_count: cart.itemCount,
      updated_at: new Date().toISOString()
    };

    let result;

    if (existingCart) {
      // Update existing cart
      const { data, error } = await selectFields(
        supabase
          .from('carts')
          .update(cartData)
          .eq('user_id', userId)
          .single(),
        ['id', 'items', 'subtotal', 'item_count']
      );

      if (error) {
        throw error;
      }

      result = data;
    } else {
      // Create new cart
      const { data, error } = await selectFields(
        supabase
          .from('carts')
          .insert({
            user_id: userId,
            ...cartData
          })
          .single(),
        ['id', 'items', 'subtotal', 'item_count']
      );

      if (error) {
        throw error;
      }

      result = data;
    }

    return {
      id: result.id,
      items: result.items || [],
      subtotal: result.subtotal || 0,
      itemCount: result.item_count || 0
    };
  } catch (error) {
    return handleApiError(error, 'saveCartToSupabase');
  }
};

/**
 * Add item to cart in Supabase
 * @param {string} userId - User ID
 * @param {Object} item - Item to add
 * @returns {Promise<Object>} - Updated cart
 */
const addToCartInSupabase = async (userId, item) => {
  try {
    // Get current cart
    const cart = await getCartFromSupabase(userId);

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      cartItem => cartItem.productId === item.productId && cartItem.variantId === item.variantId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Add item if it doesn't exist
      cart.items.push({
        id: `${item.productId}_${item.variantId}_${Date.now()}`,
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        image: item.image,
        price: item.price,
        weight: item.weight,
        quantity: item.quantity
      });
    }

    // Update cart totals
    cart.subtotal = calculateSubtotal(cart.items);
    cart.itemCount = calculateItemCount(cart.items);

    // Save to Supabase
    return await saveCartToSupabase(userId, cart);
  } catch (error) {
    console.error('Error in addToCartInSupabase:', error);
    throw error;
  }
};

/**
 * Update item in cart in Supabase
 * @param {string} userId - User ID
 * @param {string} itemId - ID of item to update
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} - Updated cart
 */
const updateCartItemInSupabase = async (userId, itemId, updates) => {
  try {
    // Get current cart
    const cart = await getCartFromSupabase(userId);

    // Find item in cart
    const itemIndex = cart.items.findIndex(item => item.id === itemId);

    if (itemIndex >= 0) {
      // Update item
      cart.items[itemIndex] = {
        ...cart.items[itemIndex],
        ...updates
      };

      // Update cart totals
      cart.subtotal = calculateSubtotal(cart.items);
      cart.itemCount = calculateItemCount(cart.items);

      // Save to Supabase
      return await saveCartToSupabase(userId, cart);
    }

    return cart;
  } catch (error) {
    console.error('Error in updateCartItemInSupabase:', error);
    throw error;
  }
};

/**
 * Remove item from cart in Supabase
 * @param {string} userId - User ID
 * @param {string} itemId - ID of item to remove
 * @returns {Promise<Object>} - Updated cart
 */
const removeFromCartInSupabase = async (userId, itemId) => {
  try {
    // Get current cart
    const cart = await getCartFromSupabase(userId);

    // Remove item from cart
    cart.items = cart.items.filter(item => item.id !== itemId);

    // Update cart totals
    cart.subtotal = calculateSubtotal(cart.items);
    cart.itemCount = calculateItemCount(cart.items);

    // Save to Supabase
    return await saveCartToSupabase(userId, cart);
  } catch (error) {
    console.error('Error in removeFromCartInSupabase:', error);
    throw error;
  }
};

/**
 * Clear cart in Supabase
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Empty cart
 */
const clearCartInSupabase = async (userId) => {
  try {
    const emptyCart = {
      items: [],
      subtotal: 0,
      itemCount: 0
    };

    // Save to Supabase
    return await saveCartToSupabase(userId, emptyCart);
  } catch (error) {
    console.error('Error in clearCartInSupabase:', error);
    throw error;
  }
};

// Helper functions for calculations

/**
 * Calculate subtotal from cart items
 * @param {Array} items - Cart items
 * @returns {number} - Subtotal
 */
const calculateSubtotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

/**
 * Calculate total item count from cart items
 * @param {Array} items - Cart items
 * @returns {number} - Item count
 */
const calculateItemCount = (items) => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart
};
