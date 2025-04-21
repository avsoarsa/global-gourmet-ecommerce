import { createContext, useState, useContext, useEffect } from 'react';
import { useRegion } from './RegionContext';
import { useCartNotification } from './CartNotificationContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { convertPrice } = useRegion();
  const { showNotification } = useCartNotification();

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const addToCart = (product, quantity = 1) => {
    let updatedProduct;
    let totalQuantity = quantity;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        totalQuantity = existingItem.quantity + quantity;
        updatedProduct = { ...existingItem, quantity: totalQuantity };

        return prevItems.map(item =>
          item.id === product.id
            ? updatedProduct
            : item
        );
      } else {
        updatedProduct = { ...product, quantity };
        return [...prevItems, updatedProduct];
      }
    });

    // Show notification with the product and quantity
    showNotification(product, quantity);
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // If the item has a weightOption, use that price
      const itemPrice = item.weightOption ? item.weightOption.price : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
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
