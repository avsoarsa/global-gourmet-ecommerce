/**
 * Simplified currency service that relies on static exchange rates.
 * This avoids all external network requests while still allowing
 * price conversions and formatting for the demo experience.
 */

const BASE_RATES_USD = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 145,
  CAD: 1.35,
  AUD: 1.5,
  INR: 83,
  CNY: 7.2,
  BRL: 4.9,
  RUB: 90,
  MXN: 17
};

const TAX_RATES = {
  US: 0.0725,
  ES: 0.21,
  FR: 0.2,
  GB: 0.2,
  CA: 0.13,
  AU: 0.1,
  JP: 0.1,
  IN: 0.18,
  DE: 0.19,
  IT: 0.22,
  BR: 0.17,
  MX: 0.16,
  CN: 0.13,
  RU: 0.2
};

const AVAILABLE_CURRENCIES = [
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

const getRatesForBase = (baseCurrency = 'USD') => {
  if (baseCurrency === 'USD') {
    return { base: 'USD', rates: { ...BASE_RATES_USD } };
  }

  const baseRate = BASE_RATES_USD[baseCurrency];
  if (!baseRate) {
    return { base: baseCurrency, rates: { ...BASE_RATES_USD, [baseCurrency]: 1 } };
  }

  const rates = {};
  Object.entries(BASE_RATES_USD).forEach(([currency, rate]) => {
    if (currency === baseCurrency) {
      rates[currency] = 1;
    } else if (currency === 'USD') {
      rates[currency] = 1 / baseRate;
    } else {
      rates[currency] = rate / baseRate;
    }
  });

  rates[baseCurrency] = 1;

  return { base: baseCurrency, rates };
};

export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  return getRatesForBase(baseCurrency);
};

export const getFallbackRates = (baseCurrency = 'USD') => {
  return getRatesForBase(baseCurrency);
};

export const getTaxRate = (region) => {
  return TAX_RATES[region] ?? 0;
};

export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  if (!Number.isFinite(amount)) return 0;
  if (fromCurrency === toCurrency) return amount;

  const fromRates = getRatesForBase(fromCurrency);
  const rate = fromRates.rates[toCurrency];

  if (!rate) {
    const usdValue = amount / (BASE_RATES_USD[fromCurrency] || 1);
    return usdValue * (BASE_RATES_USD[toCurrency] || 1);
  }

  return amount * rate;
};

export const calculatePriceWithTax = (price, region, includeTax = false) => {
  if (!Number.isFinite(price)) return 0;
  const taxRate = getTaxRate(region);
  return includeTax ? price : price * (1 + taxRate);
};

export const formatCurrency = (amount, currencyCode, locale = 'en-US') => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${Number(amount || 0).toFixed(2)}`;
  }
};

export const getAvailableCurrencies = () => [...AVAILABLE_CURRENCIES];

export const getCurrencySymbol = (currencyCode) => {
  const currency = AVAILABLE_CURRENCIES.find((c) => c.code === currencyCode);
  return currency ? currency.symbol : currencyCode;
};

export default {
  fetchExchangeRates,
  getFallbackRates,
  getTaxRate,
  convertCurrency,
  calculatePriceWithTax,
  formatCurrency,
  getAvailableCurrencies,
  getCurrencySymbol
};
