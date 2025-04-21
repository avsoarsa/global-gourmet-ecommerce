import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faStarHalfAlt, faShoppingCart,
  faHeart as faHeartSolid, faChevronLeft, faChevronRight,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useAuth } from '../context/AuthContext';
import { useRegion } from '../context/RegionContext';
import { products } from '../data/products';
import { getProductReviews, getProductAverageRating, addReview, markReviewAsHelpful } from '../data/reviews';
import ProductCard from '../components/common/ProductCard';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';
import ProductRecommendations from '../components/products/ProductRecommendations';
import SocialShare from '../components/common/SocialShare';
import RecipeSection from '../components/product/RecipeSection';
import WeightSelector from '../components/product/WeightSelector';
import ProductBreadcrumb from '../components/product/ProductBreadcrumb';
import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';
import FrequentlyBoughtTogether from '../components/products/FrequentlyBoughtTogether';
import RecentlyViewedProducts from '../components/products/RecentlyViewedProducts';
import CountdownTimer from '../components/common/CountdownTimer';
import LowStockIndicator from '../components/common/LowStockIndicator';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/structuredData';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedWeightOption, setSelectedWeightOption] = useState(null);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const { convertPriceSync, currencySymbol } = useRegion();
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    // Find the product by ID
    const foundProduct = products.find(p => p.id === parseInt(productId));
    if (foundProduct) {
      setProduct(foundProduct);

      // Add to recently viewed products
      addToRecentlyViewed(foundProduct);

      // Find related products (same category, excluding current product)
      const related = products
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);

      // Get product reviews
      const productReviews = getProductReviews(parseInt(productId));
      setReviews(productReviews);

      // Get average rating
      const avgRating = getProductAverageRating(parseInt(productId));
      setAverageRating(avgRating);

      // Set default weight if weight options are available
      if (foundProduct.weightOptions && foundProduct.weightOptions.length > 0) {
        const defaultWeight = foundProduct.defaultWeight || foundProduct.weightOptions[0].weight;
        setSelectedWeight(defaultWeight);

        // Find the selected weight option
        const weightOption = foundProduct.weightOptions.find(opt => opt.weight === defaultWeight);
        if (weightOption) {
          setSelectedWeightOption(weightOption);
        }
      }
    }

    // Reset quantity and review form state when product changes
    setQuantity(1);
    setIsWritingReview(false);

    // Scroll to top when product changes
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-gray-600">Product not found</p>
        <Link to="/products" className="mt-4 inline-block text-green-600 hover:text-green-700 font-medium">
          Back to Products
        </Link>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`star-${i}`} icon={faStar} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half-star" icon={faStarHalfAlt} className="text-yellow-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-star-${i}`} icon={faStar} className="text-gray-300" />);
    }

    return stars;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleWeightChange = (weight, option) => {
    setSelectedWeight(weight);
    setSelectedWeightOption(option);
  };

  const handleAddToCart = () => {
    // If product has weight options, add the selected weight option
    if (product.weightOptions && product.weightOptions.length > 0 && selectedWeightOption) {
      const productWithWeight = {
        ...product,
        price: selectedWeightOption.price,
        selectedWeight: selectedWeight,
        weightOption: selectedWeightOption
      };
      addToCart(productWithWeight, quantity);
    } else {
      // Otherwise, add the product as is
      addToCart(product, quantity);
    }
  };

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleWriteReview = () => {
    setIsWritingReview(true);
    // Scroll to review form
    setTimeout(() => {
      document.getElementById('review-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmitReview = (reviewData) => {
    const newReview = addReview(reviewData);
    setReviews([newReview, ...reviews]);
    setIsWritingReview(false);

    // Update average rating
    const newAvgRating = getProductAverageRating(parseInt(productId));
    setAverageRating(newAvgRating);

    // Show reviews tab
    setActiveTab('reviews');
  };

  const handleMarkHelpful = (reviewId) => {
    markReviewAsHelpful(reviewId);
    // Update reviews to reflect the new helpful count
    setReviews(getProductReviews(parseInt(productId)));
  };

  // Generate structured data for the product
  const productSchema = product ? generateProductSchema(product) : null;

  // Generate breadcrumb structured data
  const breadcrumbItems = [
    { name: 'Home', url: 'https://global-gourmet-ecommerce.vercel.app/' },
    { name: 'Products', url: 'https://global-gourmet-ecommerce.vercel.app/products' },
    { name: product?.category || '', url: `https://global-gourmet-ecommerce.vercel.app/category/${product?.category?.toLowerCase().replace(/\s+/g, '-')}` },
    { name: product?.name || '', url: `https://global-gourmet-ecommerce.vercel.app/product/${productId}` }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  // Combine structured data
  const structuredData = productSchema;

  return (
    <>
      {product && (
        <SEO
          title={product.name}
          description={product.description}
          keywords={[product.name, product.category, 'organic', 'premium', product.origin]}
          ogType="product"
          ogImage={product.image}
          structuredData={structuredData}
        />
      )}
      <ProductBreadcrumb productId={productId} />
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => window.history.back()}
          className="mb-4 flex items-center text-gray-600 hover:text-green-600 transition-colors"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
          Back to previous page
        </button>

      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Product Image */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="w-full h-[400px]">
              <LazyImage
                src={product.image}
                alt={product.name}
                className="w-full h-full"
                type="product"
                priority={true}
                quality={90}
              />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {renderStars(product.rating)}
            </div>
            <span className="text-gray-600">({product.reviews} reviews)</span>
          </div>

          <div className="mb-6">
            <p className="text-2xl font-bold text-green-700">
              {selectedWeightOption ? (
                <>
                  {currencySymbol}
                  {(() => {
                    const price = convertPriceSync(selectedWeightOption.price);
                    return typeof price === 'number' ? price.toFixed(2) : '0.00';
                  })()}
                </>
              ) : (
                <>
                  {currencySymbol}
                  {(() => {
                    const price = convertPriceSync(product.price);
                    return typeof price === 'number' ? price.toFixed(2) : '0.00';
                  })()}
                </>
              )}
              <span className="text-sm text-gray-500 ml-2">
                {selectedWeightOption ? `per ${selectedWeight}` : ''}
              </span>
            </p>
            {quantity > 1 && (
              <p className="text-lg text-gray-600 mt-1">
                Total: {currencySymbol}
                {(() => {
                  const basePrice = selectedWeightOption ?
                    convertPriceSync(selectedWeightOption.price) :
                    convertPriceSync(product.price);
                  const total = typeof basePrice === 'number' ? basePrice * quantity : 0;
                  return total.toFixed(2);
                })()}
                {selectedWeightOption ? ` for ${quantity} × ${selectedWeight}` : ''}
              </p>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-700 w-24">Origin:</span>
              <span className="text-gray-600">{product.origin}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-24">Nutrition:</span>
              <span className="text-gray-600">{product.nutritionalInfo}</span>
            </div>
          </div>

          <div className="mb-8">
            {/* Weight Selector */}
            {product.weightOptions && product.weightOptions.length > 0 && (
              <div className="mb-4">
                <WeightSelector
                  weightOptions={product.weightOptions}
                  defaultWeight={product.defaultWeight}
                  selectedWeight={selectedWeight}
                  onWeightChange={handleWeightChange}
                />
              </div>
            )}

            <div className="flex items-center mb-4">
              <span className="font-medium text-gray-700 mr-4">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-12 text-center border-x border-gray-300 py-1"
                />
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center mb-4 bg-green-50 p-3 rounded-md border border-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-green-800">In stock - Ships within 24 hours</span>
            </div>

            {/* Low Stock Indicator */}
            <LowStockIndicator stock={Math.floor(Math.random() * 20)} threshold={10} />

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-md font-medium transition duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-lg"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                Add to Cart
              </button>

              <button
                onClick={toggleWishlist}
                className={`border ${isInWishlist(product.id) ? 'border-red-300 text-red-500' : 'border-gray-300 text-gray-700'} hover:border-gray-400 px-4 py-3 rounded-md transition duration-300`}
                title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <FontAwesomeIcon icon={isInWishlist(product.id) ? faHeartSolid : faHeartRegular} />
              </button>

              <div className="border border-gray-300 hover:border-gray-400 px-4 py-3 rounded-md transition duration-300">
                <SocialShare
                  compact={true}
                  title={`Check out ${product.name} on Global Gourmet`}
                  description={product.description}
                  image={product.image}
                />
              </div>
            </div>

            {/* Limited Time Offer */}
            <div className="mt-4 bg-amber-50 p-4 rounded-md border border-amber-100">
              <p className="text-sm font-medium text-amber-800">
                <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded mr-2">
                  Limited Offer
                </span>
                Free shipping on orders over $50
              </p>
              <div className="mt-2 flex items-center">
                <span className="text-xs text-amber-800 mr-2">Offer ends in:</span>
                <CountdownTimer
                  endTime={Date.now() + 24 * 60 * 60 * 1000} // 24 hours from now
                  compact={true}
                  className="text-amber-800 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mb-12">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'description'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'nutrition'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Nutritional Information
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews ({product.reviews})
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recipes'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recipes
            </button>
          </nav>
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                {product.description}
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our {product.name} are sourced directly from {product.origin}, ensuring the highest quality and freshness.
                Each batch is carefully selected and undergoes rigorous quality control to meet our premium standards.
              </p>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                {product.nutritionalInfo}
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Health Benefits:</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Rich in essential nutrients and minerals</li>
                  <li>Natural source of energy</li>
                  <li>Supports overall well-being</li>
                  <li>100% natural with no additives or preservatives</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {isWritingReview ? (
                <div id="review-form-section">
                  <ReviewForm
                    productId={product.id}
                    productName={product.name}
                    onSubmit={handleSubmitReview}
                    onCancel={() => setIsWritingReview(false)}
                  />
                </div>
              ) : (
                <ReviewList
                  reviews={reviews}
                  onMarkHelpful={handleMarkHelpful}
                  onWriteReview={handleWriteReview}
                />
              )}
            </div>
          )}

          {activeTab === 'recipes' && (
            <div>
              <RecipeSection productId={product.id} />
            </div>
          )}
        </div>
      </div>

      {/* Frequently Bought Together */}
      <FrequentlyBoughtTogether product={product} />

      {/* Product Recommendations */}
      <ProductRecommendations
        currentProductId={product.id}
        category={product.category}
        products={products}
        title="You Might Also Like"
      />

      {/* Recently Viewed Products */}
      <RecentlyViewedProducts currentProductId={product.id} />

      {/* Social Sharing Section */}
      <div className="mt-12 mb-16 bg-gray-50 p-8 rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Share This Product</h2>
          <p className="text-gray-600">If you like this product, share it with your friends!</p>
        </div>
        <div className="flex justify-center">
          <SocialShare
            title={`Check out ${product.name} on Global Gourmet`}
            description={product.description}
            image={product.image}
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetailPage;
