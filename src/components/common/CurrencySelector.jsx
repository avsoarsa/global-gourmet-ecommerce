import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useRegion } from '../../context/RegionContext';
import { currencyRates } from '../../i18n';

const CurrencySelector = ({ compact = false }) => {
  const { t } = useTranslation();
  const { currency, changeCurrency, currencySymbol } = useRegion();
  const [isOpen, setIsOpen] = useState(false);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
  ];

  const handleCurrencyChange = (newCurrency) => {
    changeCurrency(newCurrency);
    setIsOpen(false);
  };

  // Compact version (for mobile or header)
  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-gray-700 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="mr-1">{currencySymbol}</span>
          <span>{currency}</span>
          <FontAwesomeIcon icon={faChevronDown} className="text-xs ml-1" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            ></div>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleCurrencyChange(c.code)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <span className="mr-2 font-medium">{c.symbol}</span>
                    {c.name}
                  </span>
                  {currency === c.code && (
                    <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Full version
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="font-medium text-gray-900 mb-3 flex items-center">
        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-green-600" />
        {t('common.selectCurrency', 'Select Currency')}
      </h3>

      <div className="grid grid-cols-1 gap-2">
        {currencies.map((c) => (
          <button
            key={c.code}
            onClick={() => handleCurrencyChange(c.code)}
            className={`flex items-center justify-between px-4 py-2 rounded-md transition-colors ${
              currency === c.code
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <span className="flex items-center">
              <span className="text-xl mr-3 font-medium">{c.symbol}</span>
              <span>{c.name}</span>
            </span>
            {currency === c.code ? (
              <FontAwesomeIcon icon={faCheck} className="text-green-600" />
            ) : (
              <span className="text-xs text-gray-500">
                1 USD = {currencyRates[c.code]} {c.code}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CurrencySelector;
