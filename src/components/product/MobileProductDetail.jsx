import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faStarHalfAlt, faShoppingCart,
  faHeart as faHeartSolid, faChevronDown, faChevronUp,
  faShare, faTruck, faShieldAlt, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import LazyImage from '../common/LazyImage';
import WeightSelector from './WeightSelector';
import SubscriptionOption from './SubscriptionOption';
import LowStockIndicator from '../common/LowStockIndicator';
import CountdownTimer from '../common/CountdownTimer';

const MobileProductDetail = ({
  product,
  selectedWeight,
  selectedWeightOption,
  quantity,
  subscriptionData,
  isInWishlist,
  currencySymbol,
  convertPriceSync,
  renderStars,
  handleWeightChange,
  handleSubscriptionChange,
  decrementQuantity,
  incrementQuantity,
  handleQuantityChange,
  handleAddToCart,
  toggleWishlist,
  setActiveTab,
  reviews
}) => {
  const [showDescription, setShowDescription] = useState(false);
  
  return (
    <div className="md:hidden">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 z-10 bg-white bg-opacity-70 rounded-full p-2 shadow-md"
        aria-label="Back"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-gray-700" />
      </button>
      
      {/* Product Image */}
      <div className="relative w-full h-[300px] mb-4">
        <LazyImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          type="product"
          priority={true}
          quality={90}
        />
        
        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md"
          aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FontAwesomeIcon
            icon={isInWishlist(product.id) ? faHeartSolid : faHeartRegular}
            className={isInWishlist(product.id) ? "text-red-500" : "text-gray-400"}
          />
        </button>
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            {product.discount}% OFF
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="px-4">
        <h1 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h1>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="flex mr-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-600">({product.reviews})</span>
          </div>
          
          <button 
            className="text-green-600 text-sm flex items-center"
            onClick={() => setActiveTab('reviews')}
          >
            See Reviews
          </button>
        </div>
        
        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-center">
            <p className="text-xl font-bold text-green-700">
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
            </p>

            {/* Original Price (MRP) */}
            {selectedWeightOption && selectedWeightOption.originalPrice ? (
              <p className="ml-2 text-sm text-gray-500 line-through">
                {currencySymbol}
                {(() => {
                  const price = convertPriceSync(selectedWeightOption.originalPrice);
                  return typeof price === 'number' ? price.toFixed(2) : '0.00';
                })()}
              </p>
            ) : product.originalPrice ? (
              <p className="ml-2 text-sm text-gray-500 line-through">
                {currencySymbol}
                {(() => {
                  const price = convertPriceSync(product.originalPrice);
                  return typeof price === 'number' ? price.toFixed(2) : '0.00';
                })()}
              </p>
            ) : null}
          </div>
          
          <p className="text-xs text-gray-500">
            {selectedWeightOption ? `per ${selectedWeight}` : ''}
          </p>
        </div>
        
        {/* Urgency Elements */}
        <div className="mb-4">
          <LowStockIndicator stock={Math.floor(Math.random() * 20)} threshold={10} />
          
          <div className="flex items-center mt-2 text-xs text-green-700">
            <FontAwesomeIcon icon={faTruck} className="mr-1" />
            <span>Free delivery on orders over $50</span>
          </div>
        </div>
        
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
        
        {/* Subscription Option */}
        <SubscriptionOption
          product={product}
          selectedWeight={selectedWeight}
          onSubscribe={handleSubscriptionChange}
        />
        
        {/* Quantity Selector */}
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
        
        {/* Limited Time Offer */}
        <div className="mb-4 bg-amber-50 p-3 rounded-md border border-amber-100">
          <p className="text-xs font-medium text-amber-800">
            <span className="inline-block bg-amber-100 text-amber-800 px-2 py-0.5 rounded mr-1">
              Limited Offer
            </span>
            Free shipping on orders over $50
          </p>
          <div className="mt-1 flex items-center">
            <span className="text-xs text-amber-800 mr-2">Offer ends in:</span>
            <CountdownTimer
              endTime={Date.now() + 24 * 60 * 60 * 1000} // 24 hours from now
              compact={true}
              className="text-amber-800 text-xs font-mono"
            />
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition duration-300 flex items-center justify-center shadow-md text-base mb-4"
        >
          <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
          Add to Cart
        </button>
        
        {/* Description Toggle */}
        <div className="border-t border-gray-200 pt-3 mb-4">
          <button 
            className="flex items-center justify-between w-full text-left"
            onClick={() => setShowDescription(!showDescription)}
          >
            <span className="font-medium">Product Description</span>
            <FontAwesomeIcon 
              icon={showDescription ? faChevronUp : faChevronDown} 
              className="text-gray-500"
            />
          </button>
          
          {showDescription && (
            <div className="mt-2 text-sm text-gray-700">
              <p className="mb-2">{product.description}</p>
              <div className="flex items-center mb-2">
                <span className="font-medium text-gray-700 w-20">Origin:</span>
                <span className="text-gray-600">{product.origin}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-20">Nutrition:</span>
                <span className="text-gray-600">{product.nutritionalInfo}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 mb-4 border-t border-b border-gray-200 py-2">
          <button 
            className="text-center py-2 text-xs font-medium text-gray-700"
            onClick={() => setActiveTab('description')}
          >
            Details
          </button>
          <button 
            className="text-center py-2 text-xs font-medium text-gray-700"
            onClick={() => setActiveTab('nutrition')}
          >
            Nutrition
          </button>
          <button 
            className="text-center py-2 text-xs font-medium text-gray-700"
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
          <button 
            className="text-center py-2 text-xs font-medium text-gray-700"
            onClick={() => setActiveTab('recipes')}
          >
            Recipes
          </button>
        </div>
        
        {/* Trust Badges */}
        <div className="flex justify-between mb-4">
          <div className="flex flex-col items-center text-center">
            <FontAwesomeIcon icon={faTruck} className="text-gray-500 mb-1" />
            <span className="text-xs text-gray-600">Fast Delivery</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <FontAwesomeIcon icon={faShieldAlt} className="text-gray-500 mb-1" />
            <span className="text-xs text-gray-600">Quality Guarantee</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg className="w-4 h-4 text-gray-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"></path>
              <path d="M10 5a1 1 0 100 2 1 1 0 000-2zm0 3a1 1 0 00-1 1v3a1 1 0 002 0V9a1 1 0 00-1-1z"></path>
            </svg>
            <span className="text-xs text-gray-600">24/7 Support</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <FontAwesomeIcon icon={faShare} className="text-gray-500 mb-1" />
            <span className="text-xs text-gray-600">Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileProductDetail;
