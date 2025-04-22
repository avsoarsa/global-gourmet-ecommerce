import { useState, useEffect, useCallback } from 'react';
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
  faLeaf,
  faLightbulb,
  faStar,
  faChartLine
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
  getRecentProductViews,
  getPersonalizedRecommendations,
  updatePersonalizationMetrics,
  getPersonalizationSettings,
  updatePersonalizationSettings
} from '../../utils/personalizationUtils';
import RecommendationFeedback from '../personalization/RecommendationFeedback';

const PersonalizedHomepage = () => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [personalizedSections, setPersonalizedSections] = useState([]);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    algorithmTime: 0
  });

  // Load personalization settings
  useEffect(() => {
    const personalizationSettings = getPersonalizationSettings();
    setSettings(personalizationSettings);
  }, []);

  // Generate personalized content when settings or user changes
  useEffect(() => {
    if (settings) {
      generatePersonalizedContent();
    }
  }, [currentUser, settings]);

  // Generate personalized content based on user data and browsing history
  const generatePersonalizedContent = () => {
    if (!settings) return;
    
    setIsLoading(true);
    const startTime = performance.now();
    
    try {
      // Get personalization profile
      const profile = getPersonalizationProfile();
      
      // Generate welcome message
      generateWelcomeMessage(profile);
      
      // Track algorithm performance
      const algorithmStartTime = performance.now();
      
      // Generate personalized sections
      const sections = [];
      const maxSections = settings.maxSections || 3;
      const maxItemsPerSection = settings.maxItemsPerSection || 8;
      
      // Personalized recommendations based on improved algorithm
      const personalizedProducts = getPersonalizedRecommendations(
        allProducts,
        maxItemsPerSection * 2, // Get more than we need to ensure variety
        []
      );
      
      // Only include personalized section if we have relevant products
      if (personalizedProducts.some(p => p.isPersonalized && p.relevanceScore > 0.3)) {
        const relevantProducts = personalizedProducts
          .filter(p => p.isPersonalized && p.relevanceScore > 0.3)
          .slice(0, maxItemsPerSection);
        
        if (relevantProducts.length > 0) {
          sections.push({
            id: 'personalized-for-you',
            title: 'Recommended For You',
            description: 'Products selected based on your preferences',
            icon: faLightbulb,
            products: relevantProducts,
            isPersonalized: true
          });
          
          // Track impressions for analytics
          updatePersonalizationMetrics('impression');
        }
      }
      
      // Recently viewed products
      const recentlyViewedProductIds = getRecentProductViews(maxItemsPerSection)
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
            products: recentlyViewedProducts.slice(0, maxItemsPerSection)
          });
        }
      }
      
      // Most viewed products
      const mostViewedProductIds = getMostViewedProducts(maxItemsPerSection)
        .map(item => parseInt(item.productId))
        .filter(id => id);
      
      if (mostViewedProductIds.length > 0 && sections.length < maxSections) {
        const mostViewedProducts = mostViewedProductIds
          .map(id => allProducts.find(p => p.id === id))
          .filter(p => p);
        
        if (mostViewedProducts.length > 0) {
          sections.push({
            id: 'most-viewed',
            title: 'Your Favorites',
            description: 'Products you\'ve shown interest in',
            icon: faHeart,
            products: mostViewedProducts.slice(0, maxItemsPerSection)
          });
        }
      }
      
      // Preferred categories
      const preferredCategories = getPreferredCategories(3)
        .map(item => item.category)
        .filter(category => category);
      
      if (preferredCategories.length > 0 && sections.length < maxSections) {
        // Only add the top preferred category to avoid too many sections
        const topCategory = preferredCategories[0];
        const categoryProducts = allProducts
          .filter(p => p.category === topCategory)
          .slice(0, maxItemsPerSection);
        
        if (categoryProducts.length > 0) {
          sections.push({
            id: `category-${topCategory.toLowerCase().replace(/\\s+/g, '-')}`,
            title: `${topCategory} Collection`,
            description: `Our best ${topCategory.toLowerCase()} products`,
            icon: getCategoryIcon(topCategory),
            products: categoryProducts
          });
        }
      }
      
      // If we don't have enough sections, add some default ones
      if (sections.length < 2) {
        // Featured products
        const featuredProducts = allProducts
          .filter(p => p.featured)
          .slice(0, maxItemsPerSection);
        
        if (featuredProducts.length > 0) {
          sections.push({
            id: 'featured',
            title: 'Featured Products',
            description: 'Our handpicked selection of premium products',
            icon: faStar,
            products: featuredProducts
          });
        }
        
        // Bestsellers
        const bestsellers = [...allProducts]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, maxItemsPerSection);
        
        if (bestsellers.length > 0 && sections.length < maxSections) {
          sections.push({
            id: 'bestsellers',
            title: 'Bestsellers',
            description: 'Our most popular products',
            icon: faChartLine,
            products: bestsellers
          });
        }
      }
      
      // Limit to max sections
      const finalSections = sections.slice(0, maxSections);
      
      // Track algorithm performance
      const algorithmEndTime = performance.now();
      const algorithmTime = algorithmEndTime - algorithmStartTime;
      
      // Update state
      setPersonalizedSections(finalSections);
      
      // Update performance metrics
      setPerformanceMetrics(prev => ({
        ...prev,
        algorithmTime
      }));
    } catch (error) {
      console.error('Error generating personalized content:', error);
      
      // Fallback to default sections
      const defaultSections = [
        {
          id: 'featured',
          title: 'Featured Products',
          description: 'Our handpicked selection of premium products',
          icon: faStar,
          products: allProducts.filter(p => p.featured).slice(0, 8)
        },
        {
          id: 'bestsellers',
          title: 'Bestsellers',
          description: 'Our most popular products',
          icon: faChartLine,
          products: [...allProducts]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 8)
        }
      ];
      
      setPersonalizedSections(defaultSections);
    } finally {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      setPerformanceMetrics(prev => ({
        ...prev,
        loadTime
      }));
      
      setIsLoading(false);
    }
  };
  
  // Track render performance
  useEffect(() => {
    if (!isLoading) {
      const renderStart = performance.now();
      
      // Use requestAnimationFrame to measure after render is complete
      requestAnimationFrame(() => {
        const renderEnd = performance.now();
        const renderTime = renderEnd - renderStart;
        
        setPerformanceMetrics(prev => ({
          ...prev,
          renderTime
        }));
      });
    }
  }, [isLoading]);
  
  // Handle product click for analytics
  const handleProductClick = useCallback((productId, sectionId) => {
    // Track click for analytics
    updatePersonalizationMetrics('click');
  }, []);

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
      
      {/* Performance Metrics (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg text-xs">
          <h3 className="font-semibold mb-2">Performance Metrics:</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="font-medium">Load Time:</span> {performanceMetrics.loadTime.toFixed(2)}ms
            </div>
            <div>
              <span className="font-medium">Algorithm Time:</span> {performanceMetrics.algorithmTime.toFixed(2)}ms
            </div>
            <div>
              <span className="font-medium">Render Time:</span> {performanceMetrics.renderTime.toFixed(2)}ms
            </div>
          </div>
        </div>
      )}

      {/* Personalized Sections */}
      {personalizedSections.map((section) => (
        <div key={section.id} className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={section.icon} className="text-green-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              {section.isPersonalized && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Personalized
                </span>
              )}
            </div>
            <Link
              to={`/products?category=${section.id.startsWith('category-') ? section.title.split(' ')[0] : ''}`}
              className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
              onClick={() => section.isPersonalized && updatePersonalizationMetrics('click')}
            >
              View All
              <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
            </Link>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-600 mb-4">{section.description}</p>
            
            {section.isPersonalized && (
              <RecommendationFeedback 
                sectionId={section.id}
                productId="section"
                compact={true}
                className="mb-4"
              />
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {section.products.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard 
                  product={product} 
                  onClick={() => handleProductClick(product.id, section.id)}
                />
                {section.isPersonalized && product.relevanceScore > 0 && (
                  <div className="absolute bottom-2 right-2">
                    <RecommendationFeedback 
                      sectionId={section.id}
                      productId={product.id}
                      compact={true}
                    />
                  </div>
                )}
              </div>
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
