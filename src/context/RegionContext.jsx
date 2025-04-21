import { createContext, useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { regionSettings } from '../i18n';
import { fetchExchangeRates, convertCurrency, calculatePriceWithTax } from '../services/currencyService';

// Create context
const RegionContext = createContext();

// Region provider component
export const RegionProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [region, setRegion] = useState('US'); // Default region
  const [currency, setCurrency] = useState('USD'); // Default currency
  const [exchangeRates, setExchangeRates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getExchangeRates();

    // Refresh exchange rates every 30 minutes
    const intervalId = setInterval(getExchangeRates, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Change region and update currency
  const changeRegion = (newRegion) => {
    if (regionSettings[newRegion]) {
      setRegion(newRegion);
      setCurrency(regionSettings[newRegion].currency);
    }
  };

  // Change currency only
  const changeCurrency = (newCurrency) => {
    // Find a region that uses this currency to get its symbol
    const regionWithCurrency = Object.keys(regionSettings).find(
      r => regionSettings[r].currency === newCurrency
    );

    if (regionWithCurrency) {
      setCurrency(newCurrency);
      // If the region is different from current, update it to get the correct symbol
      if (regionWithCurrency !== region) {
        setRegion(regionWithCurrency);
      }
    }
  };

  // Convert price from USD to current currency with tax
  const convertPrice = (priceUSD, includeTax = true) => {
    if (!exchangeRates) return parseFloat(priceUSD); // Fallback if rates not loaded

    // Convert currency
    const convertedPrice = convertCurrency(parseFloat(priceUSD), 'USD', currency, exchangeRates);

    // Apply tax if needed
    return includeTax ? calculatePriceWithTax(convertedPrice, region) : convertedPrice;
  };

  // Format price with currency symbol
  const formatPrice = (price, includeTax = true) => {
    const symbol = currentRegionSettings.currencySymbol || '$';
    return `${symbol}${convertPrice(price, includeTax).toFixed(2)}`;
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
    currencySymbol: currentRegionSettings.currencySymbol,
    language: i18n.language,
    changeRegion,
    changeCurrency,
    convertPrice,
    formatPrice,
    getShippingOptions,
    isFreeShipping,
    availableRegions: Object.keys(regionSettings),
    isLoading,
    exchangeRates
  };

  return (
    <RegionContext.Provider value={value}>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        children
      )}
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
