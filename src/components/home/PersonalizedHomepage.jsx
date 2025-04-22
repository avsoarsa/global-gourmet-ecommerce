import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faHistory,
  faHeart,
  faShoppingCart,
  faSearch,
  faTag,
  faBoxOpen,
  faLeaf
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useRegion } from '../../context/RegionContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { products as allProducts } from '../../data/products';
import ProductCard from '../common/ProductCard';
import {
  getPersonalizationProfile,
  getPreferredCategories,
  getMostViewedProducts,
  getRecentProductViews
} from '../../utils/personalizationUtils';

const PersonalizedHomepage = () => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [personalizedSections, setPersonalizedSections] = useState([]);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Generate personalized content
    generatePersonalizedContent();
  }, [currentUser]);
  
  // Generate personalized content based on user data and browsing history
  const generatePersonalizedContent = () => {
    setIsLoading(true);
    
    try {
      // Get personalization profile
      const profile = getPersonalizationProfile();
      
      // Generate welcome message
      generateWelcomeMessage(profile);
      
      // Generate personalized sections
      const sections = [];
      
      // Recently viewed products
      const recentlyViewedProductIds = getRecentProductViews(8)
        .map(view => parseInt(view.metadata?.productId))
        .filter(id => id); // Filter out undefined/null values
      
      if (recentlyViewedProductIds.length > 0) {
        const recentlyViewedProducts = recentlyViewedProductIds
          .map(id => allProducts.find(p => p.id === id))
          .filter(p => p); // Filter out undefined products
        
        if (recentlyViewedProducts.length > 0) {
          sections.push({
            id: 'recently-viewed',
            title: 'Recently Viewed',
            description: 'Products you\'ve viewed recently',
            icon: faHistory,
            products: recentlyViewedProducts.slice(0, 8)
          });
        }
      }
      
      // Most viewed products
      const mostViewedProductIds = getMostViewedProducts(8)
        .map(item => parseInt(item.productId))
        .filter(id => id);
      
      if (mostViewedProductIds.length > 0) {
        const mostViewedProducts = mostViewedProductIds
          .map(id => allProducts.find(p => p.id === id))
          .filter(p => p);
        
        if (mostViewedProducts.length > 0) {
          sections.push({
            id: 'most-viewed',
            title: 'Your Favorites',
            description: 'Products you\'ve shown interest in',
            icon: faHeart,
            products: mostViewedProducts.slice(0, 8)
          });
        }
      }
      
      // Preferred categories
      const preferredCategories = getPreferredCategories(3)
        .map(item => item.category)
        .filter(category => category);
      
      if (preferredCategories.length > 0) {
        preferredCategories.forEach(category => {
          const categoryProducts = allProducts
            .filter(p => p.category === category)
            .slice(0, 8);
          
          if (categoryProducts.length > 0) {
            sections.push({
              id: `category-${category.toLowerCase().replace(/\\s+/g, '-')}`,
              title: `${category} Collection`,
              description: `Our best ${category.toLowerCase()} products`,
              icon: getCategoryIcon(category),
              products: categoryProducts
            });
          }
        });
      }
      
      // If we don't have enough sections, add some default ones
      if (sections.length < 2) {
        // Featured products
        const featuredProducts = allProducts
          .filter(p => p.featured)
          .slice(0, 8);
        
        if (featuredProducts.length > 0) {
          sections.push({
            id: 'featured',
            title: 'Featured Products',
            description: 'Our handpicked selection of premium products',
            icon: faTag,
            products: featuredProducts
          });
        }
        
        // Bestsellers
        const bestsellers = [...allProducts]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 8);
        
        if (bestsellers.length > 0) {
          sections.push({
            id: 'bestsellers',
            title: 'Bestsellers',
            description: 'Our most popular products',
            icon: faShoppingCart,
            products: bestsellers
          });
        }
      }
      
      // Update state
      setPersonalizedSections(sections);
    } catch (error) {
      console.error('Error generating personalized content:', error);
      
      // Fallback to default sections
      const defaultSections = [
        {
          id: 'featured',
          title: 'Featured Products',
          description: 'Our handpicked selection of premium products',
          icon: faTag,
          products: allProducts.filter(p => p.featured).slice(0, 8)
        },
        {
          id: 'bestsellers',
          title: 'Bestsellers',
          description: 'Our most popular products',
          icon: faShoppingCart,
          products: [...allProducts]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 8)
        }
      ];
      
      setPersonalizedSections(defaultSections);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate personalized welcome message
  const generateWelcomeMessage = (profile) => {
    let message = '';
    
    if (currentUser) {
      // Logged in user
      const firstName = currentUser.firstName || currentUser.name?.split(' ')[0] || 'there';
      
      const timeOfDay = getTimeOfDay();
      message = `Good ${timeOfDay}, ${firstName}!`;
      
      // Add personalized touch if we have profile data
      if (profile && profile.preferences.topCategories.length > 0) {
        const topCategory = profile.preferences.topCategories[0];
        message += ` We have some amazing ${topCategory.toLowerCase()} for you today.`;
      } else {
        message += ' Welcome back to Global Gourmet.';
      }
    } else {
      // Guest user
      const timeOfDay = getTimeOfDay();
      message = `Good ${timeOfDay}! Welcome to Global Gourmet.`;
      
      // Add personalized touch if we have profile data
      if (profile && profile.preferences.topCategories.length > 0) {
        const topCategory = profile.preferences.topCategories[0];
        message += ` Explore our premium ${topCategory.toLowerCase()} collection.`;
      } else {
        message += ' Discover our premium selection of dry fruits and spices.';
      }
    }
    
    setWelcomeMessage(message);
  };
  
  // Get time of day greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };
  
  // Get icon for category
  const getCategoryIcon = (category) => {
    const categoryIcons = {
      'Dry Fruits': faLeaf,
      'Spices': faLeaf,
      'Nuts': faLeaf,
      'Superfoods': faLeaf,
      'Gift Boxes': faBoxOpen,
      'Organic': faLeaf
    };
    
    return categoryIcons[category] || faTag;
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {welcomeMessage}
        </h1>
        <p className="text-gray-600">
          Discover premium quality products tailored just for you.
        </p>
      </div>
      
      {/* Personalized Sections */}
      {personalizedSections.map((section) => (
        <div key={section.id} className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={section.icon} className="text-green-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
            </div>
            <Link
              to={`/products?category=${section.id.startsWith('category-') ? section.title.split(' ')[0] : ''}`}
              className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
            >
              View All
              <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
            </Link>
          </div>
          
          <p className="text-gray-600 mb-4">{section.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {section.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
      
      {personalizedSections.length === 0 && (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-5xl mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Personalized Content Yet</h2>
          <p className="text-gray-600 mb-4">
            Browse our products to get personalized recommendations.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Explore Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default PersonalizedHomepage;
