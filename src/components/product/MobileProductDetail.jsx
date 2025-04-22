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
  activeTab,
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

        {/* Share Button */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
              })
              .catch(err => console.error('Error sharing:', err));
            } else {
              // Fallback for browsers that don't support Web Share API
              alert('Sharing is not supported in this browser');
            }
          }}
          className="absolute top-4 right-16 z-10 bg-white rounded-full p-2 shadow-md"
          aria-label="Share product"
        >
          <FontAwesomeIcon
            icon={faShare}
            className="text-gray-600"
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
        <div className="mobile-product-tabs overflow-x-auto flex mb-4 border-t border-gray-200 py-2 no-scrollbar">
          <div className="flex w-full justify-between px-1">
            <button
              className={`mobile-product-tab whitespace-nowrap px-3 py-2 rounded-full text-sm font-medium flex-1 mx-1 ${activeTab === 'description' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('description')}
            >
              Details
            </button>
            <button
              className={`mobile-product-tab whitespace-nowrap px-3 py-2 rounded-full text-sm font-medium flex-1 mx-1 ${activeTab === 'nutrition' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('nutrition')}
            >
              Nutrition
            </button>
            <button
              className={`mobile-product-tab whitespace-nowrap px-3 py-2 rounded-full text-sm font-medium flex-1 mx-1 ${activeTab === 'reviews' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button
              className={`mobile-product-tab whitespace-nowrap px-3 py-2 rounded-full text-sm font-medium flex-1 mx-1 ${activeTab === 'recipes' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('recipes')}
            >
              Recipe
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-6 border-b border-gray-200 pb-6">
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="text-sm text-gray-700">
              <p className="mb-4">{product.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Origin</h4>
                  <p>{product.origin || 'Information not available'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Storage</h4>
                  <p>Store in a cool, dry place away from direct sunlight.</p>
                </div>
              </div>
            </div>
          )}

          {/* Nutrition Tab */}
          {activeTab === 'nutrition' && (
            <div className="text-sm">
              <h4 className="font-medium mb-3">Nutritional Information</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="mb-2">{product.nutritionalInfo || 'Detailed nutritional information not available.'}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Calories</span>
                    <span className="font-medium">240 kcal</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Protein</span>
                    <span className="font-medium">6g</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Carbs</span>
                    <span className="font-medium">12g</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Fat</span>
                    <span className="font-medium">18g</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Fiber</span>
                    <span className="font-medium">3g</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Sugar</span>
                    <span className="font-medium">2g</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">Values are approximate and may vary by product batch.</p>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Customer Reviews</h4>
                <div className="flex items-center">
                  <div className="flex mr-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews})</span>
                </div>
              </div>

              {reviews && reviews.length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {renderStars(review.rating)}
                          </div>
                          <span className="font-medium text-sm">{review.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}

          {/* Recipes Tab */}
          {activeTab === 'recipes' && (
            <div>
              <h4 className="font-medium mb-3">Recipes with {product.name}</h4>
              {product.recipes && product.recipes.length > 0 ? (
                <div className="space-y-4">
                  {product.recipes.map((recipe, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <h5 className="font-medium text-green-700 mb-1">{recipe.title}</h5>
                      <p className="text-sm mb-2">{recipe.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-3">{recipe.prepTime} prep</span>
                        <span>{recipe.cookTime} cook</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm mb-2">Try these delicious ways to use {product.name}:</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Add to your morning smoothie for extra nutrition</li>
                    <li>Mix into yogurt with honey for a healthy snack</li>
                    <li>Sprinkle over salads for added crunch and flavor</li>
                    <li>Use in baking for natural sweetness and texture</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileProductDetail;
