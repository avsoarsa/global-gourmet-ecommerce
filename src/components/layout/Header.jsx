import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faShoppingCart, faUser, faBars, faTimes, faHeart,
  faHome, faLeaf, faGift, faBoxes, faInfoCircle, faShoppingBag, faSignOutAlt,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useRegion } from '../../context/RegionContext';
import RegionSelector from '../common/RegionSelector';
import CurrencySelector from '../common/CurrencySelector';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { t, i18n } = useTranslation();
  const { region, currency } = useRegion();

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Set initial scroll state
    setIsScrolled(true);

    window.addEventListener('scroll', handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close account menu when mobile menu is toggled
    if (isAccountMenuOpen) setIsAccountMenuOpen(false);
  };

  const toggleAccountMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAccountMenuOpen(!isAccountMenuOpen);
    if (isLanguageMenuOpen) setIsLanguageMenuOpen(false);
  };

  const toggleLanguageMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
    if (isAccountMenuOpen) setIsAccountMenuOpen(false);
  };

  // Change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageMenuOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAccountMenuOpen && !event.target.closest('.account-menu-container')) {
        setIsAccountMenuOpen(false);
      }
      if (isLanguageMenuOpen && !event.target.closest('.language-menu-container')) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountMenuOpen, isLanguageMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with the query parameter
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="backdrop-blur-md bg-white/95 shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2">
      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent transition-all duration-300">{t('common.appName')}</Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-all duration-300 font-medium relative group">
              {t('navigation.home')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-green-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-green-600 transition-all duration-300 font-medium relative group">
              {t('navigation.products')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-green-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/gift-boxes" className="text-gray-700 hover:text-green-600 transition-all duration-300 font-medium relative group">
              {t('navigation.giftBoxes')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-green-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/bulk-orders" className="text-gray-700 hover:text-green-600 transition-all duration-300 font-medium relative group">
              {t('navigation.bulkOrders')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-green-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition-all duration-300 font-medium relative group">
              {t('navigation.about')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-green-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Search, Cart, User */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t('common.searchPlaceholder')}
                className="form-input pl-10 pr-4 py-2 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </form>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative language-menu-container">
                <button
                  onClick={toggleLanguageMenu}
                  className="text-gray-700 hover:text-green-600 transition-all duration-300 flex items-center"
                  aria-expanded={isLanguageMenuOpen}
                  aria-label="Language menu"
                >
                  <FontAwesomeIcon icon={faGlobe} className="mr-1" />
                  <span className="text-xs uppercase">{i18n.language}</span>
                </button>
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-sm rounded-md shadow-lg py-1 z-10 border border-green-100/50 animate-fade-in">
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`w-full text-left px-4 py-2 text-sm ${i18n.language === 'en' ? 'text-green-600 font-medium' : 'text-gray-700'} hover:bg-green-50 hover:text-green-700 transition-colors duration-200 flex justify-between items-center`}
                    >
                      <span>English</span>
                      {i18n.language === 'en' && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <button
                      onClick={() => changeLanguage('es')}
                      className={`w-full text-left px-4 py-2 text-sm ${i18n.language === 'es' ? 'text-green-600 font-medium' : 'text-gray-700'} hover:bg-green-50 hover:text-green-700 transition-colors duration-200 flex justify-between items-center`}
                    >
                      <span>Español</span>
                      {i18n.language === 'es' && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <button
                      onClick={() => changeLanguage('fr')}
                      className={`w-full text-left px-4 py-2 text-sm ${i18n.language === 'fr' ? 'text-green-600 font-medium' : 'text-gray-700'} hover:bg-green-50 hover:text-green-700 transition-colors duration-200 flex justify-between items-center`}
                    >
                      <span>Français</span>
                      {i18n.language === 'fr' && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                  </div>
                )}
              </div>

              {/* Region Selector */}
              <RegionSelector compact={true} />

              {/* Currency Selector */}
              <CurrencySelector compact={true} />

              <Link to="/cart" className="text-gray-700 hover:text-green-700 relative">
                <FontAwesomeIcon icon={faShoppingCart} size="lg" className="transition-all duration-300 transform hover:scale-110" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              <Link to="/wishlist" className="text-gray-700 hover:text-red-500 relative">
                <FontAwesomeIcon icon={faHeart} size="lg" className="transition-all duration-300 transform hover:scale-110" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>

              {currentUser ? (
                <div className="relative account-menu-container">
                  <button
                    onClick={toggleAccountMenu}
                    className="text-gray-700 hover:text-green-600 transition-all duration-300 transform hover:scale-110"
                    aria-expanded={isAccountMenuOpen}
                    aria-label="Account menu"
                  >
                    <FontAwesomeIcon icon={faUser} size="lg" className="transition-all duration-300" />
                  </button>
                  {isAccountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-md shadow-lg py-1 z-10 border border-green-100/50 animate-fade-in">
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" /> {t('navigation.account')}
                      </Link>
                      <Link
                        to="/account?tab=orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faShoppingBag} className="mr-2 text-green-600" /> {t('account.orders')}
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-green-600" /> {t('navigation.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-gray-700 hover:text-green-700">
                  <FontAwesomeIcon icon={faUser} size="lg" className="transition-all duration-300 transform hover:scale-110" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <nav className="flex flex-col space-y-3 pb-3 border-b border-green-200">
              <Link to="/" className="text-gray-700 hover:text-green-600 font-medium pl-2 border-l-4 border-transparent hover:border-l-4 hover:border-green-500 transition-all duration-300 py-2 flex items-center" onClick={toggleMenu}>
                <span className="bg-green-100/50 p-1.5 rounded-full mr-3">
                  <FontAwesomeIcon icon={faHome} className="text-green-600 text-sm" />
                </span>
                {t('navigation.home')}
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-green-600 font-medium pl-2 border-l-4 border-transparent hover:border-l-4 hover:border-green-500 transition-all duration-300 py-2 flex items-center" onClick={toggleMenu}>
                <span className="bg-green-100/50 p-1.5 rounded-full mr-3">
                  <FontAwesomeIcon icon={faLeaf} className="text-green-600 text-sm" />
                </span>
                {t('navigation.products')}
              </Link>
              <Link to="/gift-boxes" className="text-gray-700 hover:text-green-600 font-medium pl-2 border-l-4 border-transparent hover:border-l-4 hover:border-green-500 transition-all duration-300 py-2 flex items-center" onClick={toggleMenu}>
                <span className="bg-green-100/50 p-1.5 rounded-full mr-3">
                  <FontAwesomeIcon icon={faGift} className="text-green-600 text-sm" />
                </span>
                {t('navigation.giftBoxes')}
              </Link>
              <Link to="/bulk-orders" className="text-gray-700 hover:text-green-600 font-medium pl-2 border-l-4 border-transparent hover:border-l-4 hover:border-green-500 transition-all duration-300 py-2 flex items-center" onClick={toggleMenu}>
                <span className="bg-green-100/50 p-1.5 rounded-full mr-3">
                  <FontAwesomeIcon icon={faBoxes} className="text-green-600 text-sm" />
                </span>
                {t('navigation.bulkOrders')}
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-green-600 font-medium pl-2 border-l-4 border-transparent hover:border-l-4 hover:border-green-500 transition-all duration-300 py-2 flex items-center" onClick={toggleMenu}>
                <span className="bg-green-100/50 p-1.5 rounded-full mr-3">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-green-600 text-sm" />
                </span>
                {t('navigation.about')}
              </Link>
            </nav>

            <div className="mt-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder={t('common.searchPlaceholder')}
                  className="form-input w-full pl-10 pr-4 py-2 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </form>

              {/* Language and Region Selectors */}
              <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="w-full">
                  <p className="text-sm font-medium mb-2 text-gray-700">
                    <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                    {t('common.language', 'Language')}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`px-3 py-1 text-sm rounded-md ${i18n.language === 'en' ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => changeLanguage('es')}
                      className={`px-3 py-1 text-sm rounded-md ${i18n.language === 'es' ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Español
                    </button>
                    <button
                      onClick={() => changeLanguage('fr')}
                      className={`px-3 py-1 text-sm rounded-md ${i18n.language === 'fr' ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Français
                    </button>
                  </div>
                </div>

                <div className="w-full">
                  <p className="text-sm font-medium mb-2 text-gray-700">
                    {t('common.region', 'Region')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <RegionSelector compact={true} />
                    <CurrencySelector compact={true} />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex space-x-4">
                  <Link to="/cart" className="text-gray-700 hover:text-green-700 flex items-center" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                    {t('navigation.cart')} ({getCartCount()})
                  </Link>

                  <Link to="/wishlist" className="text-gray-700 hover:text-red-500 flex items-center" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faHeart} className="mr-2" />
                    {t('navigation.wishlist')}
                  </Link>
                </div>

                {currentUser ? (
                  <div className="space-y-2">
                    <Link to="/account" className="block text-gray-700 hover:text-green-700" onClick={toggleMenu}>
                      {t('navigation.account')}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        toggleMenu();
                      }}
                      className="text-gray-700 hover:text-green-700"
                    >
                      {t('navigation.logout')}
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="text-gray-700 hover:text-green-700 flex items-center" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    {t('navigation.login')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
