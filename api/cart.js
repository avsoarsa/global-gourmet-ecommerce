import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-session-id'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get user ID from auth or session ID from headers
  const sessionId = req.headers['x-session-id'] || uuidv4();
  let userId = null;
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    userId = user.id;
  }

  // GET: Fetch cart
  if (req.method === 'GET') {
    try {
      // Find or create cart
      let cart;
      
      if (userId) {
        // Find cart by user ID
        const { data: userCart, error: userCartError } = await supabase
          .from('carts')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (userCartError && userCartError.code !== 'PGRST116') {
          throw userCartError;
        }
        
        cart = userCart;
      } else {
        // Find cart by session ID
        const { data: sessionCart, error: sessionCartError } = await supabase
          .from('carts')
          .select('*')
          .eq('session_id', sessionId)
          .is('user_id', null)
          .single();
          
        if (sessionCartError && sessionCartError.code !== 'PGRST116') {
          throw sessionCartError;
        }
        
        cart = sessionCart;
      }
      
      // If no cart exists, create one
      if (!cart) {
        const { data: newCart, error: newCartError } = await supabase
          .from('carts')
          .insert({
            user_id: userId,
            session_id: userId ? null : sessionId,
            currency: 'USD'
          })
          .select()
          .single();
          
        if (newCartError) {
          throw newCartError;
        }
        
        cart = newCart;
      }
      
      // Get cart items
      const { data: cartItems, error: cartItemsError } = await supabase
        .from('cart_items')
        .select(`
          *,
          products:product_id (*),
          product_variants:product_variant_id (*)
        `)
        .eq('cart_id', cart.id);
        
      if (cartItemsError) {
        throw cartItemsError;
      }
      
      return res.status(200).json({
        success: true,
        data: {
          ...cart,
          items: cartItems
        },
        meta: {
          session_id: sessionId
        }
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while fetching cart',
          details: error.message
        }
      });
    }
  }
  
  // POST: Add item to cart
  if (req.method === 'POST') {
    try {
      const { product_id, product_variant_id, quantity } = req.body;
      
      if (!product_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PRODUCT_ID',
            message: 'Product ID is required'
          }
        });
      }
      
      // Find or create cart
      let cart;
      
      if (userId) {
        // Find cart by user ID
        const { data: userCart, error: userCartError } = await supabase
          .from('carts')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (userCartError && userCartError.code !== 'PGRST116') {
          throw userCartError;
        }
        
        cart = userCart;
      } else {
        // Find cart by session ID
        const { data: sessionCart, error: sessionCartError } = await supabase
          .from('carts')
          .select('*')
          .eq('session_id', sessionId)
          .is('user_id', null)
          .single();
          
        if (sessionCartError && sessionCartError.code !== 'PGRST116') {
          throw sessionCartError;
        }
        
        cart = sessionCart;
      }
      
      // If no cart exists, create one
      if (!cart) {
        const { data: newCart, error: newCartError } = await supabase
          .from('carts')
          .insert({
            user_id: userId,
            session_id: userId ? null : sessionId,
            currency: 'USD'
          })
          .select()
          .single();
          
        if (newCartError) {
          throw newCartError;
        }
        
        cart = newCart;
      }
      
      // Get product price
      let price;
      if (product_variant_id) {
        const { data: variant, error: variantError } = await supabase
          .from('product_variants')
          .select('price')
          .eq('id', product_variant_id)
          .single();
          
        if (variantError) {
          throw variantError;
        }
        
        price = variant.price;
      } else {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('price')
          .eq('id', product_id)
          .single();
          
        if (productError) {
          throw productError;
        }
        
        price = product.price;
      }
      
      // Check if item already exists in cart
      const { data: existingItem, error: existingItemError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .eq('product_id', product_id)
        .eq('product_variant_id', product_variant_id || null)
        .single();
        
      if (existingItemError && existingItemError.code !== 'PGRST116') {
        throw existingItemError;
      }
      
      let cartItem;
      
      if (existingItem) {
        // Update existing item
        const { data: updatedItem, error: updateError } = await supabase
          .from('cart_items')
          .update({
            quantity: existingItem.quantity + (quantity || 1)
          })
          .eq('id', existingItem.id)
          .select()
          .single();
          
        if (updateError) {
          throw updateError;
        }
        
        cartItem = updatedItem;
      } else {
        // Add new item
        const { data: newItem, error: newItemError } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cart.id,
            product_id,
            product_variant_id: product_variant_id || null,
            quantity: quantity || 1,
            price_at_addition: price
          })
          .select()
          .single();
          
        if (newItemError) {
          throw newItemError;
        }
        
        cartItem = newItem;
      }
      
      // Update cart totals
      const { data: cartItems, error: cartItemsError } = await supabase
        .from('cart_items')
        .select(`
          *,
          products:product_id (price)
        `)
        .eq('cart_id', cart.id);
        
      if (cartItemsError) {
        throw cartItemsError;
      }
      
      const subtotal = cartItems.reduce((sum, item) => {
        return sum + (item.price_at_addition * item.quantity);
      }, 0);
      
      const { data: updatedCart, error: updateCartError } = await supabase
        .from('carts')
        .update({
          subtotal,
          total: subtotal,
          item_count: cartItems.length,
          updated_at: new Date(),
          last_active: new Date()
        })
        .eq('id', cart.id)
        .select()
        .single();
        
      if (updateCartError) {
        throw updateCartError;
      }
      
      return res.status(200).json({
        success: true,
        data: {
          cart: updatedCart,
          item: cartItem
        },
        meta: {
          session_id: sessionId
        }
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while adding item to cart',
          details: error.message
        }
      });
    }
  }
  
  // DELETE: Remove item from cart
  if (req.method === 'DELETE') {
    try {
      const { item_id } = req.query;
      
      if (!item_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_ITEM_ID',
            message: 'Item ID is required'
          }
        });
      }
      
      // Find cart
      let cart;
      
      if (userId) {
        // Find cart by user ID
        const { data: userCart, error: userCartError } = await supabase
          .from('carts')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (userCartError) {
          throw userCartError;
        }
        
        cart = userCart;
      } else {
        // Find cart by session ID
        const { data: sessionCart, error: sessionCartError } = await supabase
          .from('carts')
          .select('*')
          .eq('session_id', sessionId)
          .is('user_id', null)
          .single();
          
        if (sessionCartError) {
          throw sessionCartError;
        }
        
        cart = sessionCart;
      }
      
      if (!cart) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'CART_NOT_FOUND',
            message: 'Cart not found'
          }
        });
      }
      
      // Delete item from cart
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', item_id)
        .eq('cart_id', cart.id);
        
      if (deleteError) {
        throw deleteError;
      }
      
      // Update cart totals
      const { data: cartItems, error: cartItemsError } = await supabase
        .from('cart_items')
        .select(`
          *,
          products:product_id (price)
        `)
        .eq('cart_id', cart.id);
        
      if (cartItemsError) {
        throw cartItemsError;
      }
      
      const subtotal = cartItems.reduce((sum, item) => {
        return sum + (item.price_at_addition * item.quantity);
      }, 0);
      
      const { data: updatedCart, error: updateCartError } = await supabase
        .from('carts')
        .update({
          subtotal,
          total: subtotal,
          item_count: cartItems.length,
          updated_at: new Date(),
          last_active: new Date()
        })
        .eq('id', cart.id)
        .select()
        .single();
        
      if (updateCartError) {
        throw updateCartError;
      }
      
      return res.status(200).json({
        success: true,
        data: {
          cart: updatedCart
        },
        meta: {
          session_id: sessionId
        }
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while removing item from cart',
          details: error.message
        }
      });
    }
  }
  
  // PUT: Update cart item quantity
  if (req.method === 'PUT') {
    try {
      const { item_id } = req.query;
      const { quantity } = req.body;
      
      if (!item_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_ITEM_ID',
            message: 'Item ID is required'
          }
        });
      }
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_QUANTITY',
            message: 'Quantity must be at least 1'
          }
        });
      }
      
      // Find cart
      let cart;
      
      if (userId) {
        // Find cart by user ID
        const { data: userCart, error: userCartError } = await supabase
          .from('carts')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (userCartError) {
          throw userCartError;
        }
        
        cart = userCart;
      } else {
        // Find cart by session ID
        const { data: sessionCart, error: sessionCartError } = await supabase
          .from('carts')
          .select('*')
          .eq('session_id', sessionId)
          .is('user_id', null)
          .single();
          
        if (sessionCartError) {
          throw sessionCartError;
        }
        
        cart = sessionCart;
      }
      
      if (!cart) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'CART_NOT_FOUND',
            message: 'Cart not found'
          }
        });
      }
      
      // Update item quantity
      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({
          quantity
        })
        .eq('id', item_id)
        .eq('cart_id', cart.id)
        .select()
        .single();
        
      if (updateError) {
        throw updateError;
      }
      
      // Update cart totals
      const { data: cartItems, error: cartItemsError } = await supabase
        .from('cart_items')
        .select(`
          *,
          products:product_id (price)
        `)
        .eq('cart_id', cart.id);
        
      if (cartItemsError) {
        throw cartItemsError;
      }
      
      const subtotal = cartItems.reduce((sum, item) => {
        return sum + (item.price_at_addition * item.quantity);
      }, 0);
      
      const { data: updatedCart, error: updateCartError } = await supabase
        .from('carts')
        .update({
          subtotal,
          total: subtotal,
          item_count: cartItems.length,
          updated_at: new Date(),
          last_active: new Date()
        })
        .eq('id', cart.id)
        .select()
        .single();
        
      if (updateCartError) {
        throw updateCartError;
      }
      
      return res.status(200).json({
        success: true,
        data: {
          cart: updatedCart,
          item: updatedItem
        },
        meta: {
          session_id: sessionId
        }
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while updating cart item',
          details: error.message
        }
      });
    }
  }
  
  // Return 405 for other methods
  return res.status(405).json({
    success: false,
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message: `Method ${req.method} not allowed`
    }
  });
}
