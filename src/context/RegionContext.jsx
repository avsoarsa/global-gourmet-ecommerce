import { createContext, useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { regionSettings } from '../i18n';
import {
  fetchExchangeRates,
  convertCurrency,
  calculatePriceWithTax,
  formatCurrency,
  getAvailableCurrencies,
  getCurrencySymbol,
  getFallbackRates
} from '../services/currencyService';

// Create context
const RegionContext = createContext();

// Region provider component
export const RegionProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [region, setRegion] = useState(() => {
    // Try to get region from localStorage
    const savedRegion = localStorage.getItem('userRegion');
    return savedRegion || 'US'; // Default to US if not found
  });

  const [currency, setCurrency] = useState(() => {
    // Try to get currency from localStorage
    const savedCurrency = localStorage.getItem('userCurrency');
    return savedCurrency || 'USD'; // Default to USD if not found
  });

  const [exchangeRates, setExchangeRates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCurrencies, setAvailableCurrencies] = useState(getAvailableCurrencies());
  const [error, setError] = useState(null);

  // Get region settings based on current region
  const currentRegionSettings = regionSettings[region] || regionSettings.US;

  // Effect to update language when region changes
  useEffect(() => {
    if (currentRegionSettings.language) {
      i18n.changeLanguage(currentRegionSettings.language);
    }
  }, [region, currentRegionSettings.language, i18n]);

  // Effect to fetch exchange rates
  useEffect(() => {
    const getExchangeRates = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Set a timeout to stop showing the loading screen after 3 seconds
        // This prevents the app from being stuck on the loading screen if the API is slow
        const loadingTimeout = setTimeout(() => {
          setIsLoading(false);
        }, 3000);

        // Fetch exchange rates with the current currency as base
        const ratesData = await fetchExchangeRates(currency);

        // Clear the timeout since we got a response
        clearTimeout(loadingTimeout);

        setExchangeRates(ratesData);
        setIsLoading(false);

        // Log success for debugging
        console.log('Exchange rates updated successfully');
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        setError('Failed to fetch exchange rates. Using fallback rates.');
        setIsLoading(false);
      }
    };

    // Initialize with fallback rates immediately to prevent blank screen
    if (!exchangeRates) {
      const fallbackRates = getFallbackRates(currency);
      setExchangeRates(fallbackRates);
      console.log('Using initial fallback rates');
    }

    // Then try to fetch real rates
    getExchangeRates();

    // Refresh exchange rates every 30 minutes
    const intervalId = setInterval(getExchangeRates, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [currency]); // Re-fetch when currency changes

  // Effect to save region and currency to localStorage
  useEffect(() => {
    localStorage.setItem('userRegion', region);
    localStorage.setItem('userCurrency', currency);
  }, [region, currency]);

  // Change region and update currency
  const changeRegion = (newRegion) => {
    if (regionSettings[newRegion]) {
      setRegion(newRegion);
      setCurrency(regionSettings[newRegion].currency);
    }
  };

  // Change currency only
  const changeCurrency = (newCurrency) => {
    // Validate that the currency is in our available currencies list
    const isValidCurrency = availableCurrencies.some(c => c.code === newCurrency);

    if (isValidCurrency) {
      setCurrency(newCurrency);

      // Find a region that uses this currency to get its symbol
      const regionWithCurrency = Object.keys(regionSettings).find(
        r => regionSettings[r].currency === newCurrency
      );

      // If the region is different from current, update it to get the correct symbol
      if (regionWithCurrency && regionWithCurrency !== region) {
        setRegion(regionWithCurrency);
      }
    } else {
      console.error(`Invalid currency code: ${newCurrency}`);
    }
  };

  // Convert price from USD to current currency with tax
  const convertPrice = async (priceUSD, includeTax = true) => {
    try {
      if (!priceUSD) return 0;

      const numericPrice = parseFloat(priceUSD);
      if (isNaN(numericPrice)) return 0;

      // Convert currency using the enhanced service
      const convertedPrice = await convertCurrency(numericPrice, 'USD', currency);

      // Apply tax if needed
      return includeTax ? calculatePriceWithTax(convertedPrice, region) : convertedPrice;
    } catch (error) {
      console.error('Error converting price:', error);
      return parseFloat(priceUSD); // Fallback to original price
    }
  };

  // Synchronous version for immediate use (less accurate but faster)
  const convertPriceSync = (priceUSD, includeTax = true) => {
    try {
      if (!priceUSD) return 0;

      const numericPrice = parseFloat(priceUSD);
      if (isNaN(numericPrice)) return 0;

      // Use exchange rates directly if available
      if (exchangeRates && exchangeRates.rates) {
        const rate = exchangeRates.rates[currency] || 1;
        const convertedPrice = numericPrice * rate;
        return includeTax ? calculatePriceWithTax(convertedPrice, region) : convertedPrice;
      }

      return numericPrice; // Fallback to original price
    } catch (error) {
      console.error('Error in sync price conversion:', error);
      return parseFloat(priceUSD); // Fallback to original price
    }
  };

  // Format price with currency symbol using Intl.NumberFormat
  const formatPrice = (price, includeTax = true) => {
    const numericPrice = convertPriceSync(price, includeTax);
    return formatCurrency(numericPrice, currency, currentRegionSettings.locale || 'en-US');
  };

  // Get shipping options for current region
  const getShippingOptions = () => {
    return currentRegionSettings.shipping || regionSettings.US.shipping;
  };

  // Check if free shipping is available
  const isFreeShipping = (subtotal) => {
    const threshold = currentRegionSettings.shipping?.freeThreshold || 50;
    return subtotal >= threshold;
  };

  // Context value
  const value = {
    region,
    currency,
    currencySymbol: getCurrencySymbol(currency),
    language: i18n.language,
    locale: currentRegionSettings.locale || 'en-US',
    changeRegion,
    changeCurrency,
    convertPrice,
    convertPriceSync,
    formatPrice,
    getShippingOptions,
    isFreeShipping,
    availableRegions: Object.keys(regionSettings),
    availableCurrencies,
    isLoading,
    exchangeRates,
    error
  };

  return (
    <RegionContext.Provider value={value}>
      {/* Always render children to prevent blank screen */}
      <>
        {isLoading && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white text-center text-xs py-1">
            Loading currency data...
          </div>
        )}

        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 fixed bottom-4 right-4 z-50 shadow-lg rounded-md max-w-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {children}
      </>
    </RegionContext.Provider>
  );
};

// Custom hook to use the region context
export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};

export default RegionContext;
