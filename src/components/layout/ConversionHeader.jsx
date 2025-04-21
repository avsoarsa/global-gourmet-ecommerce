import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

/**
 * ConversionHeader - A simplified header for checkout and conversion pages
 * Removes navigation links and other distractions to focus on conversion
 */
const ConversionHeader = () => {
  const { t } = useTranslation();

  return (
    <header className="backdrop-blur-md bg-white/95 shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2">
      <div className="container mx-auto px-4 py-2 relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent transition-all duration-300">
            {t('common.appName')}
          </Link>

          {/* Secure Checkout Indicator */}
          <div className="flex items-center text-green-700">
            <FontAwesomeIcon icon={faLock} className="mr-2" />
            <span className="font-medium">Secure Checkout</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ConversionHeader;
