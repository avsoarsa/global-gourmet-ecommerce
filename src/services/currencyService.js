// This service would normally fetch real-time exchange rates from an API
// For demo purposes, we'll use hardcoded rates with a simulated API call

// Sample exchange rates (relative to USD)
const exchangeRates = {
  USD: 1.0,    // US Dollar (base currency)
  EUR: 0.85,   // Euro
  GBP: 0.75,   // British Pound
  CAD: 1.25,   // Canadian Dollar
  AUD: 1.35,   // Australian Dollar
  JPY: 110.0,  // Japanese Yen
  INR: 75.0    // Indian Rupee
};

// Sample tax rates by region
const taxRates = {
  US: 0.0725, // 7.25% average sales tax
  ES: 0.21,   // 21% VAT
  FR: 0.20,   // 20% VAT
  GB: 0.20,   // 20% VAT
  CA: 0.13,   // 13% HST
  AU: 0.10,   // 10% GST
  JP: 0.10,   // 10% consumption tax
  IN: 0.18    // 18% GST
};

/**
 * Fetch current exchange rates (simulated)
 * @returns {Promise} Promise that resolves to exchange rates object
 */
export const fetchExchangeRates = async () => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Add some random fluctuation to make it seem more realistic
      const fluctuatedRates = {};
      Object.keys(exchangeRates).forEach(currency => {
        const baseRate = exchangeRates[currency];
        // Add random fluctuation of up to ±2%
        const fluctuation = baseRate * (1 + (Math.random() * 0.04 - 0.02));
        fluctuatedRates[currency] = parseFloat(fluctuation.toFixed(4));
      });
      resolve(fluctuatedRates);
    }, 500);
  });
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
 * Convert price from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {object} rates - Exchange rates object
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first (if not already USD)
  const amountInUSD = fromCurrency === 'USD' 
    ? amount 
    : amount / rates[fromCurrency];
  
  // Convert from USD to target currency
  return amountInUSD * rates[toCurrency];
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

export default {
  fetchExchangeRates,
  getTaxRate,
  convertCurrency,
  calculatePriceWithTax
};
