import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faSearch,
  faShoppingCart,
  faUser,
  faHeart,
  faBars,
  faBoxes,
  faGift,
  faInfoCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const MobileNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { currentUser } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const moreMenuRef = useRef(null);

  // Navigation items for main bar
  const mainNavItems = [
    { path: '/', icon: faHome, label: t('navigation.home') },
    { path: '/products', icon: faSearch, label: t('navigation.products') },
    { path: '/cart', icon: faShoppingCart, label: t('navigation.cart'), count: getCartCount() },
    { path: '/wishlist', icon: faHeart, label: t('navigation.wishlist'), count: getWishlistCount() },
    { path: 'more', icon: faBars, label: t('navigation.more'), isMore: true }
  ];

  // Navigation items for more menu
  const moreNavItems = [
    { path: '/account', icon: faUser, label: t('navigation.account') },
    { path: '/gift-boxes', icon: faGift, label: t('navigation.giftBoxes') },
    { path: '/bulk-orders', icon: faBoxes, label: t('navigation.bulkOrders') },
    { path: '/about', icon: faInfoCircle, label: t('navigation.about') }
  ];

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle scroll behavior with improved performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Show/hide based on scroll direction with thresholds
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down - hide the navigation
            setIsVisible(false);
            // Also close more menu when scrolling down
            setShowMoreMenu(false);
          } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
            // Scrolling up or near top - show the navigation
            setIsVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Handle touch gestures for swipe up/down
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    // Swipe up - hide navigation
    if (diff > 50) {
      setIsVisible(false);
      setShowMoreMenu(false);
    }
    // Swipe down - show navigation
    else if (diff < -50) {
      setIsVisible(true);
    }
  };

  // Check if the current path matches the nav item
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Don't show on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* More menu overlay */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowMoreMenu(false)}
        />
      )}

      {/* More menu */}
      <div
        ref={moreMenuRef}
        className={`fixed bottom-16 right-0 left-0 bg-white border-t border-gray-200 z-40 transition-all duration-300 md:hidden ${
          showMoreMenu ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">{t('navigation.moreOptions')}</h3>
            <button
              onClick={() => setShowMoreMenu(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {moreNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-lg ${
                  isActive(item.path)
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setShowMoreMenu(false)}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-3" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <nav
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 transition-transform duration-300 md:hidden shadow-lg ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-around items-center h-16">
          {mainNavItems.map((item) => (
            <div key={item.path} className="w-1/5">
              {item.isMore ? (
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className={`flex flex-col items-center justify-center w-full h-full ${
                    showMoreMenu ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="relative">
                    <FontAwesomeIcon icon={item.icon} className="text-lg" />
                  </div>
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`flex flex-col items-center justify-center w-full h-full ${
                    isActive(item.path)
                      ? 'text-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="relative">
                    <FontAwesomeIcon icon={item.icon} className="text-lg" />
                    {item.count > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {item.count}
                      </span>
                    )}
                  </div>
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
};

export default MobileNavigation;
