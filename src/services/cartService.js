/**
 * Cart Service
 * Handles all cart-related operations
 * 
 * Note: Cart data is stored in localStorage for non-authenticated users
 * and synced with Supabase for authenticated users
 */

import { supabase } from '../utils/supabaseClient';

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
      return await getCartFromSupabase(user.id);
    } else {
      // Get cart from localStorage
      return getCartFromLocalStorage();
    }
  } catch (error) {
    console.error('Error in getCart:', error);
    // Fallback to localStorage if there's an error
    return getCartFromLocalStorage();
  }
};

/**
 * Add an item to the cart
 * @param {Object} item - Item to add to cart
 * @returns {Promise<Object>} - Updated cart
 */
export const addToCart = async (item) => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Add item to Supabase cart
      return await addToCartInSupabase(user.id, item);
    } else {
      // Add item to localStorage cart
      return addToCartInLocalStorage(item);
    }
  } catch (error) {
    console.error('Error in addToCart:', error);
    // Fallback to localStorage if there's an error
    return addToCartInLocalStorage(item);
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
const getCartFromSupabase = async (userId) => {
  try {
    // Get cart from Supabase
    const { data, error } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
      console.error('Error fetching cart from Supabase:', error);
      throw error;
    }
    
    if (data) {
      return {
        items: data.items || [],
        subtotal: data.subtotal || 0,
        itemCount: data.item_count || 0
      };
    }
  } catch (error) {
    console.error('Error in getCartFromSupabase:', error);
  }
  
  // Return empty cart if no cart in Supabase or error
  return {
    items: [],
    subtotal: 0,
    itemCount: 0
  };
};

/**
 * Save cart to Supabase
 * @param {string} userId - User ID
 * @param {Object} cart - Cart object to save
 * @returns {Promise<Object>} - Saved cart
 */
const saveCartToSupabase = async (userId, cart) => {
  try {
    // Check if cart exists
    const { data: existingCart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (existingCart) {
      // Update existing cart
      const { data, error } = await supabase
        .from('carts')
        .update({
          items: cart.items,
          subtotal: cart.subtotal,
          item_count: cart.itemCount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating cart in Supabase:', error);
        throw error;
      }
      
      return {
        items: data.items || [],
        subtotal: data.subtotal || 0,
        itemCount: data.item_count || 0
      };
    } else {
      // Create new cart
      const { data, error } = await supabase
        .from('carts')
        .insert({
          user_id: userId,
          items: cart.items,
          subtotal: cart.subtotal,
          item_count: cart.itemCount
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating cart in Supabase:', error);
        throw error;
      }
      
      return {
        items: data.items || [],
        subtotal: data.subtotal || 0,
        itemCount: data.item_count || 0
      };
    }
  } catch (error) {
    console.error('Error in saveCartToSupabase:', error);
    throw error;
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
