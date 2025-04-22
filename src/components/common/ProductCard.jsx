import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useRegion } from '../../context/RegionContext';
import LazyImage from './LazyImage';

const ProductCard = ({ product, showAddToCart = true }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { convertPriceSync, currencySymbol } = useRegion();

  // Determine if product is bestseller or organic (for demo purposes)
  const isBestseller = product.featured;
  const isOrganic = product.category === 'Superfoods' || product.id % 2 === 0; // Just for demo

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <div className="card card-hover group animate-fade-in">
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <Link to={`/product/${product.id}`} className="block">
          <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 transition-transform duration-500 group-hover:scale-105">
            <LazyImage
              src={product.image}
              alt={product.name}
              className="w-full h-full"
              type="product"
            />
          </div>
        </Link>

        {/* Quick Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={toggleWishlist}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FontAwesomeIcon
              icon={isInWishlist(product.id) ? faHeartSolid : faHeartRegular}
              className={isInWishlist(product.id) ? "text-red-500" : "text-gray-400"}
            />
          </button>

          {showAddToCart && (
            <button
              onClick={handleAddToCart}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Add to cart"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* Product Label */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount && (
            <span className="badge-danger">
              {product.discount}% OFF
            </span>
          )}
          {isBestseller && (
            <span className="badge-accent">
              BESTSELLER
            </span>
          )}
          {isOrganic && (
            <span className="badge-primary">
              ORGANIC
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3 md:p-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-sm sm:text-base font-medium mb-1 text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2">
            {product.description}
          </p>

          <div className="flex justify-between items-center mt-3">
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold text-green-700">
                {currencySymbol}
                {(() => {
                  const price = convertPriceSync(product.price);
                  return typeof price === 'number' ? price.toFixed(2) : '0.00';
                })()}
              </span>
              {product.originalPrice && (
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm text-gray-500 line-through">
                    {currencySymbol}
                    {(() => {
                      const price = convertPriceSync(product.originalPrice);
                      return typeof price === 'number' ? price.toFixed(2) : '0.00';
                    })()}
                  </span>
                  {product.discount && (
                    <span className="text-xs font-medium text-red-600">
                      -{product.discount}%
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Desktop buttons */}
            <div className="hidden sm:block">
              {showAddToCart ? (
                <button
                  onClick={handleAddToCart}
                  className="btn-primary py-1.5 px-3 text-sm"
                >
                  Add to Cart
                </button>
              ) : (
                <button className="btn-secondary py-1.5 px-3 text-sm">
                  View Details
                </button>
              )}
            </div>

            {/* Mobile compact button */}
            <div className="sm:hidden">
              {showAddToCart ? (
                <button
                  onClick={handleAddToCart}
                  className="btn-primary py-1 px-2 text-xs rounded-full w-8 h-8 flex items-center justify-center"
                  aria-label="Add to cart"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="text-white" />
                </button>
              ) : (
                <button className="btn-secondary py-1 px-2 text-xs">
                  View
                </button>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
