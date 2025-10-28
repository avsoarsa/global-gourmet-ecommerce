'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useCartNotification } from './CartNotificationContext';
import { useRegion } from './RegionContext';

const STORAGE_KEY = 'global_gourmet_cart';

const CartContext = createContext();

const ensureNumeric = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const deriveItemId = (product) => {
  const baseId = product.productId || product.id || product.sku || Math.random().toString(36).slice(2);
  const weight = product.selectedWeight || product.weightOption?.weight || 'default';
  const subscriptionKey = product.isSubscription ? `sub-${product.subscriptionFrequency || 'recurring'}` : 'std';
  return `${baseId}-${weight}-${subscriptionKey}`;
};

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useCartNotification();
  const { convertPriceSync } = useRegion();

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to persist cart to storage:', error);
    }
  }, [cartItems, loading]);

  const computeUnitPrice = (item) => {
    if (item.isSubscription) {
      return ensureNumeric(item.subscriptionPrice || item.price);
    }

    if (item.weightOption?.price) {
      return ensureNumeric(item.weightOption.price);
    }

    return ensureNumeric(item.price);
  };

  const addToCart = (product, quantity = 1) => {
    if (!product) return;

    const normalizedQuantity = Math.max(1, Number(quantity) || 1);
    const itemId = deriveItemId(product);
    const unitPrice = computeUnitPrice(product);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);

      if (existingIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + normalizedQuantity
        };
        return updatedItems;
      }

      const newItem = {
        id: itemId,
        productId: product.id ?? product.productId ?? itemId,
        name: product.name,
        image: product.image,
        category: product.category,
        price: product.price ?? unitPrice,
        originalPrice: product.originalPrice,
        quantity: normalizedQuantity,
        weightOption: product.weightOption ?? null,
        selectedWeight: product.selectedWeight ?? product.weightOption?.weight ?? null,
        isSubscription: product.isSubscription ?? false,
        subscriptionFrequency: product.subscriptionFrequency ?? null,
        subscriptionPrice: product.subscriptionPrice ?? null,
        subscriptionDiscount: product.subscriptionDiscount ?? null,
        metadata: {
          weightOptions: product.weightOptions ?? [],
          tags: product.tags ?? [],
          origin: product.origin ?? null
        }
      };

      return [...prevItems, newItem];
    });

    showNotification(product, normalizedQuantity);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    const normalizedQuantity = Math.max(1, Number(quantity) || 1);
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: normalizedQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const unitPrice = computeUnitPrice(item);
      return total + unitPrice * item.quantity;
    }, 0);
  };

  const getCartTotalConverted = () => {
    const total = getCartTotal();
    const converted = convertPriceSync(total);
    return ensureNumeric(converted);
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
    getCartTotalConverted,
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
