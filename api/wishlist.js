import { createClient } from '@supabase/supabase-js';

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
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if user is authenticated
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'NOT_AUTHENTICATED',
        message: 'User is not authenticated'
      }
    });
  }

  // GET: Get user's wishlist
  if (req.method === 'GET') {
    try {
      // Find or create wishlist
      const { data: wishlist, error: wishlistError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id)
        .eq('name', 'Default Wishlist')
        .single();
        
      if (wishlistError && wishlistError.code !== 'PGRST116') {
        throw wishlistError;
      }
      
      let userWishlist = wishlist;
      
      // If no wishlist exists, create one
      if (!userWishlist) {
        const { data: newWishlist, error: newWishlistError } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            name: 'Default Wishlist'
          })
          .select()
          .single();
          
        if (newWishlistError) {
          throw newWishlistError;
        }
        
        userWishlist = newWishlist;
      }
      
      // Get wishlist items
      const { data: wishlistItems, error: wishlistItemsError } = await supabase
        .from('wishlist_items')
        .select(`
          *,
          products:product_id (*),
          product_variants:product_variant_id (*)
        `)
        .eq('wishlist_id', userWishlist.id);
        
      if (wishlistItemsError) {
        throw wishlistItemsError;
      }
      
      return res.status(200).json({
        success: true,
        data: {
          ...userWishlist,
          items: wishlistItems
        }
      });
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while fetching wishlist',
          details: error.message
        }
      });
    }
  }
  
  // POST: Add item to wishlist
  if (req.method === 'POST') {
    try {
      const { product_id, product_variant_id } = req.body;
      
      if (!product_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PRODUCT_ID',
            message: 'Product ID is required'
          }
        });
      }
      
      // Find or create wishlist
      const { data: wishlist, error: wishlistError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id)
        .eq('name', 'Default Wishlist')
        .single();
        
      if (wishlistError && wishlistError.code !== 'PGRST116') {
        throw wishlistError;
      }
      
      let userWishlist = wishlist;
      
      // If no wishlist exists, create one
      if (!userWishlist) {
        const { data: newWishlist, error: newWishlistError } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            name: 'Default Wishlist'
          })
          .select()
          .single();
          
        if (newWishlistError) {
          throw newWishlistError;
        }
        
        userWishlist = newWishlist;
      }
      
      // Check if item already exists in wishlist
      const { data: existingItem, error: existingItemError } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('wishlist_id', userWishlist.id)
        .eq('product_id', product_id)
        .eq('product_variant_id', product_variant_id || null)
        .single();
        
      if (existingItemError && existingItemError.code !== 'PGRST116') {
        throw existingItemError;
      }
      
      // If item already exists, return success
      if (existingItem) {
        return res.status(200).json({
          success: true,
          data: {
            message: 'Item already in wishlist',
            item: existingItem
          }
        });
      }
      
      // Add item to wishlist
      const { data: newItem, error: newItemError } = await supabase
        .from('wishlist_items')
        .insert({
          wishlist_id: userWishlist.id,
          product_id,
          product_variant_id: product_variant_id || null
        })
        .select()
        .single();
        
      if (newItemError) {
        throw newItemError;
      }
      
      return res.status(200).json({
        success: true,
        data: {
          message: 'Item added to wishlist',
          item: newItem
        }
      });
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while adding item to wishlist',
          details: error.message
        }
      });
    }
  }
  
  // DELETE: Remove item from wishlist
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
      
      // Find wishlist
      const { data: wishlist, error: wishlistError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (wishlistError) {
        throw wishlistError;
      }
      
      // Delete item from wishlist
      const { error: deleteError } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', item_id)
        .eq('wishlist_id', wishlist.id);
        
      if (deleteError) {
        throw deleteError;
      }
      
      return res.status(200).json({
        success: true,
        data: {
          message: 'Item removed from wishlist'
        }
      });
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while removing item from wishlist',
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
