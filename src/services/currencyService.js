/**
 * Currency Service
 * Handles currency conversion and formatting with real-time exchange rates
 */

// API endpoint for exchange rates
const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';

// Cache for exchange rates to reduce API calls
let exchangeRatesCache = {
  rates: null,
  timestamp: 0,
  baseCurrency: 'USD'
};

// Cache expiration time (1 hour)
const CACHE_EXPIRATION = 60 * 60 * 1000;

// Sample tax rates by region
const taxRates = {
  US: 0.0725, // 7.25% average sales tax
  ES: 0.21,   // 21% VAT
  FR: 0.20,   // 20% VAT
  GB: 0.20,   // 20% VAT
  CA: 0.13,   // 13% HST
  AU: 0.10,   // 10% GST
  JP: 0.10,   // 10% consumption tax
  IN: 0.18,   // 18% GST
  DE: 0.19,   // 19% VAT
  IT: 0.22,   // 22% VAT
  BR: 0.17,   // 17% ICMS
  MX: 0.16,   // 16% VAT
  CN: 0.13,   // 13% VAT
  RU: 0.20    // 20% VAT
};

/**
 * Fetch latest exchange rates from API
 * @param {string} baseCurrency - Base currency for rates
 * @returns {Promise<Object>} - Exchange rates data
 */
export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  try {
    // Check if we have cached rates that are still valid
    const now = Date.now();
    if (
      exchangeRatesCache.rates &&
      exchangeRatesCache.baseCurrency === baseCurrency &&
      now - exchangeRatesCache.timestamp < CACHE_EXPIRATION
    ) {
      return exchangeRatesCache.rates;
    }

    // Fetch new rates from API
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.status}`);
    }

    const data = await response.json();

    // Update cache
    exchangeRatesCache = {
      rates: data,
      timestamp: now,
      baseCurrency
    };

    return data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);

    // If we have cached rates, return those even if expired
    if (exchangeRatesCache.rates) {
      return exchangeRatesCache.rates;
    }

    // Otherwise, return fallback rates
    return getFallbackRates(baseCurrency);
  }
};

/**
 * Get fallback exchange rates when API fails
 * @param {string} baseCurrency - Base currency for rates
 * @returns {Object} - Fallback exchange rates
 */
const getFallbackRates = (baseCurrency = 'USD') => {
  // Common exchange rates as fallback (as of 2023)
  const fallbackRates = {
    USD: {
      EUR: 0.92,
      GBP: 0.79,
      JPY: 145.0,
      CAD: 1.35,
      AUD: 1.50,
      INR: 83.0,
      CNY: 7.20,
      BRL: 4.90,
      RUB: 90.0,
      MXN: 17.0
    }
  };

  // If base currency is USD, return directly
  if (baseCurrency === 'USD') {
    return {
      base: 'USD',
      rates: {
        USD: 1,
        EUR: fallbackRates.USD.EUR,
        GBP: fallbackRates.USD.GBP,
        JPY: fallbackRates.USD.JPY,
        CAD: fallbackRates.USD.CAD,
        AUD: fallbackRates.USD.AUD,
        INR: fallbackRates.USD.INR,
        CNY: fallbackRates.USD.CNY,
        BRL: fallbackRates.USD.BRL,
        RUB: fallbackRates.USD.RUB,
        MXN: fallbackRates.USD.MXN
      }
    };
  }

  // For other base currencies, calculate based on USD rates
  const rates = { [baseCurrency]: 1 };
  const usdToBase = 1 / fallbackRates.USD[baseCurrency];

  Object.entries(fallbackRates.USD).forEach(([currency, rate]) => {
    if (currency !== baseCurrency) {
      rates[currency] = rate * usdToBase;
    }
  });

  rates.USD = usdToBase;

  return {
    base: baseCurrency,
    rates
  };
};

/**
 * Get tax rate for a specific region
 * @param {string} region - Region code
 * @returns {number} Tax rate as a decimal
 */
export const getTaxRate = (region) => {
  return taxRates[region] || 0;
};

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {Promise<number>} - Converted amount
 */
export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  try {
    // Get exchange rates with fromCurrency as base
    const exchangeRates = await fetchExchangeRates(fromCurrency);

    // Get conversion rate
    const rate = exchangeRates.rates[toCurrency];

    if (!rate) {
      throw new Error(`Exchange rate not available for ${toCurrency}`);
    }

    // Convert amount
    return amount * rate;
  } catch (error) {
    console.error('Error converting currency:', error);

    // Fallback to estimate
    const fallbackRates = getFallbackRates(fromCurrency);
    return amount * fallbackRates.rates[toCurrency];
  }
};

/**
 * Format currency amount according to locale
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code (USD, EUR, etc.)
 * @param {string} locale - Locale for formatting (en-US, fr-FR, etc.)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currencyCode, locale = 'en-US') => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);

    // Fallback formatting
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'C$',
      AUD: 'A$',
      INR: '₹',
      CNY: '¥',
      BRL: 'R$',
      RUB: '₽',
      MXN: 'Mex$'
    };

    const symbol = symbols[currencyCode] || currencyCode;
    return `${symbol}${amount.toFixed(2)}`;
  }
};

/**
 * Calculate price with tax
 * @param {number} price - Base price
 * @param {string} region - Region code
 * @param {boolean} includeTax - Whether tax is already included
 * @returns {number} Price with tax
 */
export const calculatePriceWithTax = (price, region, includeTax = false) => {
  const taxRate = getTaxRate(region);

  if (includeTax) {
    return price; // Tax already included
  } else {
    return price * (1 + taxRate);
  }
};

/**
 * Get list of available currencies
 * @returns {Array<Object>} - List of currency objects with code, name and symbol
 */
export const getAvailableCurrencies = () => {
  return [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$' }
  ];
};

/**
 * Get currency symbol for a currency code
 * @param {string} currencyCode - Currency code
 * @returns {string} - Currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
  const currency = getAvailableCurrencies().find(c => c.code === currencyCode);
  return currency ? currency.symbol : currencyCode;
};

export default {
  fetchExchangeRates,
  getTaxRate,
  convertCurrency,
  calculatePriceWithTax,
  formatCurrency,
  getAvailableCurrencies,
  getCurrencySymbol
};
