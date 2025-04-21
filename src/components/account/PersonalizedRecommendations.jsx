import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, faHeart, faArrowRight, 
  faArrowLeft, faInfoCircle, faThumbsUp, faThumbsDown 
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useRegion } from '../../context/RegionContext';
import { products } from '../../data/products';

// Recommendation Card Component
const RecommendationCard = ({ product, onAddToCart, onAddToWishlist, onFeedback }) => {
  const { t } = useTranslation();
  const { formatPrice } = useRegion();
  const [showFeedback, setShowFeedback] = useState(false);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    onAddToCart(product);
  };
  
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    onAddToWishlist(product);
  };
  
  const handleFeedback = (isPositive) => {
    onFeedback(product.id, isPositive);
    setShowFeedback(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-48 bg-gray-200">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discount}% OFF
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-gray-400 text-sm line-through ml-2">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleAddToCart}
                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                title={t('products.addToCart')}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
              </button>
              <button
                onClick={handleAddToWishlist}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title={t('wishlist.addToWishlist')}
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
            </div>
          </div>
        </div>
      </Link>
      
      {!showFeedback ? (
        <div className="px-4 pb-4">
          <button
            onClick={() => setShowFeedback(true)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {t('account.isThisRelevant')}
          </button>
        </div>
      ) : (
        <div className="px-4 pb-4 flex items-center">
          <span className="text-xs text-gray-500 mr-2">{t('account.isThisRelevant')}</span>
          <button
            onClick={() => handleFeedback(true)}
            className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors mr-1"
            title={t('account.relevant')}
          >
            <FontAwesomeIcon icon={faThumbsUp} className="text-xs" />
          </button>
          <button
            onClick={() => handleFeedback(false)}
            className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title={t('account.notRelevant')}
          >
            <FontAwesomeIcon icon={faThumbsDown} className="text-xs" />
          </button>
        </div>
      )}
    </div>
  );
};

// Recommendation Section Component
const RecommendationSection = ({ title, description, products, onAddToCart, onAddToWishlist, onFeedback }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 2;
  
  const handleNext = () => {
    if (currentIndex + itemsPerPage < products.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full ${
              currentIndex === 0 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label={t('common.previous')}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex + itemsPerPage >= products.length}
            className={`p-2 rounded-full ${
              currentIndex + itemsPerPage >= products.length 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label={t('common.next')}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.slice(currentIndex, currentIndex + itemsPerPage).map(product => (
          <RecommendationCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            onFeedback={onFeedback}
          />
        ))}
      </div>
    </div>
  );
};

// Main PersonalizedRecommendations Component
const PersonalizedRecommendations = ({ user, orderHistory = [] }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [recommendations, setRecommendations] = useState({
    recentlyViewed: [],
    basedOnPurchases: [],
    trending: [],
    forYou: []
  });
  
  // Generate recommendations based on user data
  useEffect(() => {
    // For demo purposes, we'll just use the products data
    // In a real app, this would be an API call to a recommendation engine
    
    // Recently viewed (random selection for demo)
    const recentlyViewed = getRandomProducts(4);
    
    // Based on purchases (filter by categories from order history)
    let purchaseCategories = [];
    if (orderHistory.length > 0) {
      orderHistory.forEach(order => {
        order.items.forEach(item => {
          const product = products.find(p => p.id === item.id);
          if (product && !purchaseCategories.includes(product.category)) {
            purchaseCategories.push(product.category);
          }
        });
      });
    }
    
    const basedOnPurchases = purchaseCategories.length > 0
      ? products.filter(p => purchaseCategories.includes(p.category)).slice(0, 8)
      : getRandomProducts(8);
    
    // Trending products (products with highest rating)
    const trending = [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
    
    // For you (personalized mix)
    const forYou = getRandomProducts(8);
    
    setRecommendations({
      recentlyViewed,
      basedOnPurchases,
      trending,
      forYou
    });
  }, [orderHistory]);
  
  // Helper function to get random products
  const getRandomProducts = (count) => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const handleFeedback = (productId, isPositive) => {
    // In a real app, this would send feedback to the recommendation engine
    console.log(`Feedback for product ${productId}: ${isPositive ? 'Relevant' : 'Not Relevant'}`);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('account.personalizedRecommendations')}
        </h2>
        <p className="text-gray-600 mt-1">
          {t('account.recommendationsDesc')}
        </p>
      </div>
      
      {Object.values(recommendations).every(arr => arr.length === 0) ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('account.noRecommendations')}
          </h3>
          <p className="text-gray-600">
            {t('account.noRecommendationsDesc')}
          </p>
        </div>
      ) : (
        <div>
          {recommendations.recentlyViewed.length > 0 && (
            <RecommendationSection
              title={t('account.recentlyViewed')}
              products={recommendations.recentlyViewed}
              onAddToCart={addToCart}
              onAddToWishlist={addToWishlist}
              onFeedback={handleFeedback}
            />
          )}
          
          {recommendations.basedOnPurchases.length > 0 && (
            <RecommendationSection
              title={t('account.basedOnPurchases')}
              description={t('account.basedOnPurchasesDesc')}
              products={recommendations.basedOnPurchases}
              onAddToCart={addToCart}
              onAddToWishlist={addToWishlist}
              onFeedback={handleFeedback}
            />
          )}
          
          {recommendations.trending.length > 0 && (
            <RecommendationSection
              title={t('account.trending')}
              description={t('account.trendingDesc')}
              products={recommendations.trending}
              onAddToCart={addToCart}
              onAddToWishlist={addToWishlist}
              onFeedback={handleFeedback}
            />
          )}
          
          {recommendations.forYou.length > 0 && (
            <RecommendationSection
              title={t('account.justForYou')}
              description={t('account.justForYouDesc')}
              products={recommendations.forYou}
              onAddToCart={addToCart}
              onAddToWishlist={addToWishlist}
              onFeedback={handleFeedback}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalizedRecommendations;
