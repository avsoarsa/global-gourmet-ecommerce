import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import wishlistService from '../services/wishlistService';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // Use wishlistService instead of localStorage
        if (currentUser) {
          const result = await wishlistService.getWishlist();
          if (result.success) {
            // Extract product IDs from the wishlist items
            const productIds = result.data.items.map(item => item.productId);
            setWishlistItems(productIds);
          } else {
            console.error('Error fetching wishlist:', result.error);
            setWishlistItems([]);
          }
        } else {
          // If not logged in, try to get from localStorage
          const storedWishlist = localStorage.getItem('wishlist');
          if (storedWishlist) {
            setWishlistItems(JSON.parse(storedWishlist));
          } else {
            setWishlistItems([]);
          }
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [currentUser]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, loading]);

  const addToWishlist = async (productId) => {
    try {
      if (currentUser) {
        // Use wishlistService if user is logged in
        const result = await wishlistService.addToWishlist(productId);
        if (result.success) {
          // Update local state
          setWishlistItems(prevItems => {
            if (prevItems.includes(productId)) {
              return prevItems;
            } else {
              return [...prevItems, productId];
            }
          });
        } else {
          console.error('Error adding to wishlist:', result.error);
        }
      } else {
        // Use localStorage if not logged in
        setWishlistItems(prevItems => {
          if (prevItems.includes(productId)) {
            return prevItems;
          } else {
            return [...prevItems, productId];
          }
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (currentUser) {
        // Use wishlistService if user is logged in
        const result = await wishlistService.removeFromWishlist(productId);
        if (result.success) {
          // Update local state
          setWishlistItems(prevItems => prevItems.filter(id => id !== productId));
        } else {
          console.error('Error removing from wishlist:', result.error);
        }
      } else {
        // Use localStorage if not logged in
        setWishlistItems(prevItems => prevItems.filter(id => id !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  const clearWishlist = async () => {
    try {
      if (currentUser) {
        // Use wishlistService if user is logged in
        const result = await wishlistService.clearWishlist();
        if (result.success) {
          // Update local state
          setWishlistItems([]);
        } else {
          console.error('Error clearing wishlist:', result.error);
        }
      } else {
        // Use localStorage if not logged in
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
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
