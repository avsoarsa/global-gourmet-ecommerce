import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/CartContext';
import { useRegion } from '../../context/RegionContext';

const PersistentCartBar = () => {
  const { cartItems, getCartTotal, getCartCount } = useCart();
  const { currencySymbol, convertPriceSync } = useRegion();
  const location = useLocation();

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  // Don't render if cart is empty or if we're on the cart page
  if (cartCount === 0 || location.pathname === '/cart') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center justify-between z-50 md:hidden shadow-lg persistent-cart-bar">
      <div className="flex items-center">
        <div className="relative mr-2">
          <FontAwesomeIcon icon={faShoppingCart} className="text-green-600 text-xl" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount}
          </span>
        </div>
        <div>
          <span className="text-xs text-gray-500">Total:</span>
          <span className="text-base font-bold text-green-700 ml-1">
            {currencySymbol}
            {(() => {
              const price = convertPriceSync(cartTotal);
              return typeof price === 'number' ? price.toFixed(2) : '0.00';
            })()}
          </span>
        </div>
      </div>

      <Link
        to="/cart"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center"
      >
        View Cart
        <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
      </Link>
    </div>
  );
};

export default PersistentCartBar;
