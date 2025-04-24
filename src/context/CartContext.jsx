import { createContext, useState, useContext, useEffect } from 'react';
import { useRegion } from './RegionContext';
import { useCartNotification } from './CartNotificationContext';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { convertPrice } = useRegion();
  const { showNotification } = useCartNotification();
  const { currentUser } = useAuth();

  // Load cart from API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Use cartService instead of direct API calls
        const result = await cartService.getCart();

        if (result.success) {
          setCartItems(result.data.items || []);
          setCartId(result.data.id);
        } else {
          console.error('Error fetching cart:', result.error);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [currentUser]);

  const addToCart = async (product, quantity = 1, variantId = null) => {
    try {
      // Use cartService instead of direct API calls
      const result = await cartService.addToCart({
        product_id: product.id,
        variant_id: variantId,
        quantity
      });

      if (result.success) {
        // Update cart items from the result
        setCartItems(result.data.items || []);
        setCartId(result.data.id);

        // Show notification with the product and quantity
        showNotification(product, quantity);
      } else {
        console.error('Error adding to cart:', result.error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      // Use cartService instead of direct API calls
      const result = await cartService.removeCartItem(itemId);

      if (result.success) {
        // Update cart items from the result
        setCartItems(result.data.items || []);
        setCartId(result.data.id);
      } else {
        console.error('Error removing from cart:', result.error);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    try {
      // Use cartService instead of direct API calls
      const result = await cartService.updateCartItem(itemId, quantity);

      if (result.success) {
        // Update cart items from the result
        setCartItems(result.data.items || []);
        setCartId(result.data.id);
      } else {
        console.error('Error updating cart:', result.error);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      // Use cartService instead of direct API calls
      const result = await cartService.clearCart();

      if (result.success) {
        // Update cart items to empty array
        setCartItems([]);
      } else {
        console.error('Error clearing cart:', result.error);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // If the item has a product_variant, use that price
      const itemPrice = item.product_variant_id ?
        (item.product_variants?.price || item.price_at_addition) :
        (item.products?.price || item.price_at_addition);

      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    cartId,
    sessionId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {!loading && children}
    </CartContext.Provider>
  );
};

export default CartContext;
