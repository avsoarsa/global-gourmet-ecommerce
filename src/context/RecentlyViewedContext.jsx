import { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext();

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const maxItems = 8; // Maximum number of items to store

  // Load recently viewed products from localStorage on mount
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem('recentlyViewedProducts');
      if (storedItems) {
        setRecentlyViewed(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Error loading recently viewed products:', error);
    }
  }, []);

  // Save to localStorage whenever the list changes
  useEffect(() => {
    try {
      localStorage.setItem('recentlyViewedProducts', JSON.stringify(recentlyViewed));
    } catch (error) {
      console.error('Error saving recently viewed products:', error);
    }
  }, [recentlyViewed]);

  // Add a product to recently viewed
  const addToRecentlyViewed = (product) => {
    if (!product) return;
    
    setRecentlyViewed(prev => {
      // Remove the product if it already exists in the list
      const filtered = prev.filter(item => item.id !== product.id);
      
      // Add the product to the beginning of the list
      const updated = [product, ...filtered];
      
      // Limit the list to maxItems
      return updated.slice(0, maxItems);
    });
  };

  // Clear recently viewed products
  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('recentlyViewedProducts');
  };

  // Get recently viewed products excluding the current product
  const getRecentlyViewedExcept = (productId) => {
    return recentlyViewed.filter(product => product.id !== productId);
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
        getRecentlyViewedExcept
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export default RecentlyViewedContext;
