import {
  fetchExchangeRates,
  convertCurrency,
  formatCurrency,
  getAvailableCurrencies,
  getCurrencySymbol,
  getTaxRate,
  calculatePriceWithTax
} from '../currencyService';

// Mock fetch
global.fetch = jest.fn();

describe('currencyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('fetchExchangeRates', () => {
    test('fetches exchange rates from API', async () => {
      // Mock successful API response
      const mockResponse = {
        base: 'USD',
        rates: {
          USD: 1,
          EUR: 0.85,
          GBP: 0.75
        }
      };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await fetchExchangeRates();
      
      // Check if fetch was called with the correct URL
      expect(global.fetch).toHaveBeenCalledWith('https://api.exchangerate-api.com/v4/latest/USD');
      
      // Check if the result is correct
      expect(result).toEqual(mockResponse);
    });
    
    test('returns fallback rates when API fails', async () => {
      // Mock failed API response
      global.fetch.mockRejectedValueOnce(new Error('API error'));
      
      const result = await fetchExchangeRates();
      
      // Check if fetch was called
      expect(global.fetch).toHaveBeenCalled();
      
      // Check if the result contains fallback rates
      expect(result).toHaveProperty('base', 'USD');
      expect(result).toHaveProperty('rates');
      expect(result.rates).toHaveProperty('USD', 1);
      expect(result.rates).toHaveProperty('EUR');
      expect(result.rates).toHaveProperty('GBP');
    });
    
    test('uses cached rates if available and not expired', async () => {
      // First call to set the cache
      const mockResponse = {
        base: 'USD',
        rates: {
          USD: 1,
          EUR: 0.85,
          GBP: 0.75
        }
      };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      await fetchExchangeRates();
      
      // Second call should use cache
      const result = await fetchExchangeRates();
      
      // Fetch should only be called once
      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      // Result should be the same as the first call
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('convertCurrency', () => {
    test('converts currency correctly', async () => {
      // Mock fetchExchangeRates
      const mockRates = {
        base: 'USD',
        rates: {
          USD: 1,
          EUR: 0.85,
          GBP: 0.75
        }
      };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRates
      });
      
      // Convert 100 USD to EUR
      const result = await convertCurrency(100, 'USD', 'EUR');
      
      // Check if the result is correct
      expect(result).toBeCloseTo(85, 2);
    });
    
    test('returns original amount when currencies are the same', async () => {
      const result = await convertCurrency(100, 'USD', 'USD');
      
      // Check if the result is the same as the input
      expect(result).toBe(100);
      
      // Fetch should not be called
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
  
  describe('formatCurrency', () => {
    test('formats currency correctly', () => {
      // Format 100 USD
      const result = formatCurrency(100, 'USD');
      
      // Check if the result is correct
      expect(result).toBe('$100.00');
    });
    
    test('formats currency with different locale', () => {
      // Format 100 EUR with French locale
      const result = formatCurrency(100, 'EUR', 'fr-FR');
      
      // Check if the result is correct (French uses comma as decimal separator)
      expect(result).toBe('100,00 €');
    });
    
    test('handles invalid currency code gracefully', () => {
      // Format with invalid currency code
      const result = formatCurrency(100, 'INVALID');
      
      // Should fallback to using the code as symbol
      expect(result).toBe('INVALID100.00');
    });
  });
  
  describe('getAvailableCurrencies', () => {
    test('returns list of available currencies', () => {
      const currencies = getAvailableCurrencies();
      
      // Check if the result is an array
      expect(Array.isArray(currencies)).toBe(true);
      
      // Check if it contains common currencies
      expect(currencies.some(c => c.code === 'USD')).toBe(true);
      expect(currencies.some(c => c.code === 'EUR')).toBe(true);
      expect(currencies.some(c => c.code === 'GBP')).toBe(true);
      
      // Check if each currency has the required properties
      currencies.forEach(currency => {
        expect(currency).toHaveProperty('code');
        expect(currency).toHaveProperty('name');
        expect(currency).toHaveProperty('symbol');
      });
    });
  });
  
  describe('getCurrencySymbol', () => {
    test('returns correct symbol for currency code', () => {
      expect(getCurrencySymbol('USD')).toBe('$');
      expect(getCurrencySymbol('EUR')).toBe('€');
      expect(getCurrencySymbol('GBP')).toBe('£');
    });
    
    test('returns currency code for unknown currency', () => {
      expect(getCurrencySymbol('UNKNOWN')).toBe('UNKNOWN');
    });
  });
  
  describe('getTaxRate', () => {
    test('returns correct tax rate for region', () => {
      expect(getTaxRate('US')).toBe(0.0725);
      expect(getTaxRate('GB')).toBe(0.20);
      expect(getTaxRate('JP')).toBe(0.10);
    });
    
    test('returns 0 for unknown region', () => {
      expect(getTaxRate('UNKNOWN')).toBe(0);
    });
  });
  
  describe('calculatePriceWithTax', () => {
    test('adds tax to price correctly', () => {
      // Calculate price with US tax (7.25%)
      const result = calculatePriceWithTax(100, 'US', false);
      
      // Check if the result is correct
      expect(result).toBe(107.25);
    });
    
    test('returns original price when tax is already included', () => {
      const result = calculatePriceWithTax(100, 'US', true);
      
      // Check if the result is the same as the input
      expect(result).toBe(100);
    });
  });
});
