import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCheckCircle, faTimes, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useRegion } from '../../context/RegionContext';
import { useSwipeHandlers } from '../../utils/touchInteractions';

/**
 * CartNotification - Displays a notification when a product is added to the cart
 * with options to continue shopping or proceed to checkout
 */
const CartNotification = ({ product, quantity, onClose, isVisible }) => {
  const { formatPrice } = useRegion();
  const [animationClass, setAnimationClass] = useState('translate-y-full');
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const notificationRef = useRef(null);

  // Handle animation states
  useEffect(() => {
    let timer;
    if (isVisible) {
      // Animate in
      setAnimationClass('translate-y-0');

      // Auto-close after 3 seconds
      timer = setTimeout(() => {
        setAnimationClass('translate-y-full');
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 3000);
    } else {
      setAnimationClass('translate-y-full');
    }

    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  // Handle manual close
  const handleClose = () => {
    setAnimationClass('translate-y-full');
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  // Handle touch events for swipe to dismiss
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (touchStartY === null) return;

    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;

    // Calculate vertical and horizontal distance moved
    const deltaY = touchStartY - touchY;
    const deltaX = touchStartX - touchX;

    // If swiping more horizontal than vertical and it's a significant movement
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      // Prevent default to avoid page scrolling
      e.preventDefault();
      return;
    }

    // If swiping up (deltaY > 0)
    if (deltaY > 10) {
      // Apply transform to follow finger
      const translateY = Math.min(deltaY, 200);
      if (notificationRef.current) {
        notificationRef.current.style.transform = `translateY(-${translateY}px)`;
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartY === null) return;

    const touchY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchY;

    // If swiped up significantly
    if (deltaY > 80) {
      handleClose();
    } else {
      // Reset position if not swiped enough
      if (notificationRef.current) {
        notificationRef.current.style.transform = '';
      }
    }

    // Reset touch coordinates
    setTouchStartX(null);
    setTouchStartY(null);
  };

  if (!product) return null;

  return (
    <div
      ref={notificationRef}
      className={`fixed bottom-0 inset-x-0 z-50 transform transition-transform duration-300 ease-in-out ${animationClass}`}
      aria-live="polite"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container mx-auto px-4 pb-4">
        <div className="bg-white rounded-t-lg shadow-lg border border-green-100 p-4 md:p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center text-green-600">
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-xl" />
              <h3 className="font-bold text-lg">Added to Cart</h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notification"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center mb-4">
            <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mr-4 mb-3 md:mb-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-grow text-center md:text-left">
              <h4 className="font-medium text-gray-800">{product.name}</h4>
              <p className="text-gray-600 text-sm">
                Quantity: {quantity} {product.selectedWeight ? `(${product.selectedWeight})` : ''}
              </p>
              <p className="font-bold text-gray-900 mt-1">
                {formatPrice(product.weightOption ? product.weightOption.price * quantity : product.price * quantity)}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/cart"
              className="btn-primary py-2 px-4 flex items-center justify-center"
              onClick={handleClose}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartNotification;
