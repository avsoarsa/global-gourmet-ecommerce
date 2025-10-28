'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'global_gourmet_wishlist';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (currentUser?.wishlist) {
        setWishlistItems(currentUser.wishlist);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setWishlistItems(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error('Failed to load wishlist from storage:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (loading || currentUser) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Failed to persist wishlist:', error);
    }
  }, [wishlistItems, loading, currentUser]);

  const persistForUser = (items) => {
    if (!currentUser) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to persist wishlist for guest:', error);
      }
      return;
    }

    updateUserProfile({ wishlist: items });
  };

  const addToWishlist = (productId) => {
    setWishlistItems((prev) => {
      if (prev.includes(productId)) {
        return prev;
      }
      const updated = [...prev, productId];
      persistForUser(updated);
      return updated;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => {
      const updated = prev.filter((id) => id !== productId);
      persistForUser(updated);
      return updated;
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    persistForUser([]);
  };

  const isInWishlist = (productId) => wishlistItems.includes(productId);

  const getWishlistCount = () => wishlistItems.length;

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
    loading
  };

  return (
    <WishlistContext.Provider value={value}>
      {!loading && children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
