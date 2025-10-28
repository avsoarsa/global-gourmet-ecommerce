'use client';

import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { regionSettings } from '../i18n';
import {
  fetchExchangeRates,
  convertCurrency,
  calculatePriceWithTax,
  formatCurrency,
  getAvailableCurrencies,
  getCurrencySymbol,
  getTaxRate
} from '../services/currencyService';

const RegionContext = createContext();

const REGION_STORAGE_KEY = 'global_gourmet_region';
const CURRENCY_STORAGE_KEY = 'global_gourmet_currency';

export const useRegion = () => useContext(RegionContext);

export const RegionProvider = ({ children }) => {
  const { i18n } = useTranslation();

  const [region, setRegion] = useState(() => {
    if (typeof window === 'undefined') return 'US';
    return localStorage.getItem(REGION_STORAGE_KEY) || 'US';
  });

  const [currency, setCurrency] = useState(() => {
    if (typeof window === 'undefined') return 'USD';
    return localStorage.getItem(CURRENCY_STORAGE_KEY) || 'USD';
  });

  const [exchangeRates, setExchangeRates] = useState(() => ({
    base: currency,
    rates: {}
  }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const availableCurrencies = useMemo(() => getAvailableCurrencies(), []);
  const availableRegions = useMemo(() => Object.keys(regionSettings), []);

  useEffect(() => {
    const updateLanguage = () => {
      const targetLanguage = regionSettings[region]?.language;
      if (targetLanguage) {
        i18n.changeLanguage(targetLanguage);
      }
    };

    updateLanguage();
  }, [region, i18n]);

  useEffect(() => {
    const loadRates = async () => {
      setLoading(true);
      setError(null);

      try {
        const rates = await fetchExchangeRates(currency);
        setExchangeRates(rates);
      } catch (err) {
        console.error('Failed to load exchange rates:', err);
        setError('Unable to refresh exchange rates. Using fallback data.');
      } finally {
        setLoading(false);
      }
    };

    loadRates();
  }, [currency]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REGION_STORAGE_KEY, region);
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [region, currency]);

  const changeRegion = (nextRegion) => {
    if (!regionSettings[nextRegion]) return;
    setRegion(nextRegion);
    setCurrency(regionSettings[nextRegion].currency);
  };

  const changeCurrency = (nextCurrency) => {
    const isSupported = availableCurrencies.some((item) => item.code === nextCurrency);
    if (!isSupported) return;
    setCurrency(nextCurrency);
  };

  const convertPrice = async (priceUSD, includeTax = true) => {
    const converted = await convertCurrency(priceUSD, 'USD', currency);
    return includeTax ? calculatePriceWithTax(converted, region) : converted;
  };

  const convertPriceSync = (priceUSD, includeTax = true) => {
    const rate = exchangeRates?.rates?.[currency];
    const base = Number(priceUSD) || 0;
    const converted = rate ? base * rate : base;
    return includeTax ? calculatePriceWithTax(converted, region) : converted;
  };

  const formatPrice = (amount) => {
    return formatCurrency(amount, currency, regionSettings[region]?.locale || 'en-US');
  };

  const value = {
    region,
    currency,
    exchangeRates,
    availableCurrencies,
    availableRegions,
    changeRegion,
    changeCurrency,
    convertPrice,
    convertPriceSync,
    formatPrice,
    currencySymbol: getCurrencySymbol(currency),
    taxRate: getTaxRate(region),
    loading,
    error
  };

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
};

export default RegionContext;
