import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart, faUser, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useRegion } from '../../context/RegionContext';
import { useTranslation } from 'react-i18next';
import RegionSelector from '../common/RegionSelector';
import CurrencySelector from '../common/CurrencySelector';

/**
 * SimpleHeader - A clean, minimal header with just language, currency, cart, wishlist and account
 */
const SimpleHeader = () => {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { currencySymbol, currency } = useRegion();
  const { i18n } = useTranslation();

  return (
    <header className="bg-gray-50 shadow-sm fixed top-0 left-0 right-0 z-50 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Language Selector */}
            <div className="flex items-center">
              <span className="font-medium mr-1">EN</span>
              <RegionSelector compact={true} />
            </div>

            {/* Currency Selector */}
            <div className="flex items-center">
              <span className="font-medium mr-1">{currencySymbol} {currency}</span>
              <CurrencySelector compact={true} />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link to="/cart" className="text-gray-700 hover:text-green-700 relative">
              <FontAwesomeIcon icon={faShoppingCart} size="lg" className="transition-all duration-300" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="text-gray-700 hover:text-red-500 relative">
              <FontAwesomeIcon icon={faHeart} size="lg" className="transition-all duration-300" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link to="/account" className="text-gray-700 hover:text-green-700">
              <FontAwesomeIcon icon={faUser} size="lg" className="transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
