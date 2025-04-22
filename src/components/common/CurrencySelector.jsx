import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faChevronDown, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { useRegion } from '../../context/RegionContext';

const CurrencySelector = ({ compact = false }) => {
  const { t } = useTranslation();
  const {
    currency,
    changeCurrency,
    currencySymbol,
    availableCurrencies,
    exchangeRates
  } = useRegion();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCurrencyChange = (newCurrency) => {
    changeCurrency(newCurrency);
    setIsOpen(false);
  };

  // Get exchange rate for display
  const getExchangeRate = (currencyCode) => {
    if (!exchangeRates || !exchangeRates.rates) {
      return '—';
    }

    const rate = exchangeRates.rates[currencyCode];
    return rate ? rate.toFixed(4) : '—';
  };

  // Compact version (for mobile or header)
  if (compact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-gray-700 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="mr-1">{currencySymbol}</span>
          <span>{currency}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-xs ml-1 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200 max-h-80 overflow-y-auto">
            <div className="px-3 py-2 border-b border-gray-200">
              <div className="text-xs text-gray-500 mb-1">{t('common.selectCurrency', 'Select Currency')}</div>
              <div className="text-xs flex items-center text-gray-600">
                <FontAwesomeIcon icon={faExchangeAlt} className="mr-1 text-green-600" />
                <span>{t('common.liveRates', 'Live exchange rates')}</span>
              </div>
            </div>

            {availableCurrencies.map((c) => (
              <button
                key={c.code}
                onClick={() => handleCurrencyChange(c.code)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
              >
                <span className="flex items-center">
                  <span className="mr-2 font-medium">{c.symbol}</span>
                  <span className="mr-1">{c.code}</span>
                  <span className="text-xs text-gray-500">- {c.name}</span>
                </span>
                {currency === c.code ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <span className="text-xs text-gray-500">
                    {exchangeRates?.base === 'USD' ? `$1 = ${c.symbol}${getExchangeRate(c.code)}` : ''}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full version
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200" ref={dropdownRef}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 flex items-center">
          <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-green-600" />
          {t('common.selectCurrency', 'Select Currency')}
        </h3>

        <div className="text-xs flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded">
          <FontAwesomeIcon icon={faExchangeAlt} className="mr-1 text-green-600" />
          <span>{t('common.liveRates', 'Live exchange rates')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-1">
        {availableCurrencies.map((c) => (
          <button
            key={c.code}
            onClick={() => handleCurrencyChange(c.code)}
            className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors ${
              currency === c.code
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <span className="flex items-center">
              <span className="text-xl mr-3 font-medium">{c.symbol}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium">{c.name}</span>
                <span className="text-xs text-gray-500">{c.code}</span>
              </div>
            </span>
            {currency === c.code ? (
              <div className="flex items-center text-green-600">
                <span className="mr-2 text-sm">Active</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
            ) : (
              <span className="text-sm text-gray-700 font-medium">
                {exchangeRates?.base === 'USD' ?
                  `$1 = ${c.symbol}${getExchangeRate(c.code)}` :
                  `${exchangeRates?.base} 1 = ${c.symbol}${getExchangeRate(c.code)}`
                }
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CurrencySelector;
