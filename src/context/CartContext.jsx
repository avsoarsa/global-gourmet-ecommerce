import { createContext, useState, useContext, useEffect } from 'react';
import { useRegion } from './RegionContext';
import { useCartNotification } from './CartNotificationContext';
import { useAuth } from './AuthContext';

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
        // Get session ID from localStorage if it exists
        const storedSessionId = localStorage.getItem('cartSessionId');
        if (storedSessionId) {
          setSessionId(storedSessionId);
        }

        const headers = {};
        if (storedSessionId) {
          headers['x-session-id'] = storedSessionId;
        }

        const response = await fetch('/api/cart', {
          method: 'GET',
          headers
        });

        const data = await response.json();

        if (data.success) {
          setCartItems(data.data.items || []);
          setCartId(data.data.id);

          // Save session ID to localStorage
          if (data.meta?.session_id) {
            setSessionId(data.meta.session_id);
            localStorage.setItem('cartSessionId', data.meta.session_id);
          }
        } else {
          console.error('Error fetching cart:', data.error);
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
      const headers = {
        'Content-Type': 'application/json'
      };

      if (sessionId) {
        headers['x-session-id'] = sessionId;
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          product_id: product.id,
          product_variant_id: variantId,
          quantity
        })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh cart items
        const cartResponse = await fetch('/api/cart', {
          method: 'GET',
          headers: sessionId ? { 'x-session-id': sessionId } : {}
        });

        const cartData = await cartResponse.json();

        if (cartData.success) {
          setCartItems(cartData.data.items || []);
          setCartId(cartData.data.id);
        }

        // Show notification with the product and quantity
        showNotification(product, quantity);
      } else {
        console.error('Error adding to cart:', data.error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const headers = {};
      if (sessionId) {
        headers['x-session-id'] = sessionId;
      }

      const response = await fetch(`/api/cart?item_id=${itemId}`, {
        method: 'DELETE',
        headers
      });

      const data = await response.json();

      if (data.success) {
        // Refresh cart items
        const cartResponse = await fetch('/api/cart', {
          method: 'GET',
          headers: sessionId ? { 'x-session-id': sessionId } : {}
        });

        const cartData = await cartResponse.json();

        if (cartData.success) {
          setCartItems(cartData.data.items || []);
        }
      } else {
        console.error('Error removing from cart:', data.error);
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
      const headers = {
        'Content-Type': 'application/json'
      };

      if (sessionId) {
        headers['x-session-id'] = sessionId;
      }

      const response = await fetch(`/api/cart?item_id=${itemId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          quantity
        })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh cart items
        const cartResponse = await fetch('/api/cart', {
          method: 'GET',
          headers: sessionId ? { 'x-session-id': sessionId } : {}
        });

        const cartData = await cartResponse.json();

        if (cartData.success) {
          setCartItems(cartData.data.items || []);
        }
      } else {
        console.error('Error updating cart:', data.error);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const clearCart = async () => {
    // For now, we'll just remove each item individually
    for (const item of cartItems) {
      await removeFromCart(item.id);
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
