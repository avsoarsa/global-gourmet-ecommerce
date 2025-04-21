import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language files
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import frTranslation from './locales/fr.json';

// Currency conversion rates (for demo purposes)
export const currencyRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 150.23,
  INR: 83.12
};

// Region-specific settings
export const regionSettings = {
  // Add more regions here
  US: {
    currency: 'USD',
    currencySymbol: '$',
    language: 'en',
    shipping: {
      domestic: {
        standard: 5.99,
        express: 12.99,
        overnight: 24.99
      },
      international: {
        standard: 19.99,
        express: 39.99
      },
      freeThreshold: 50
    }
  },
  ES: {
    currency: 'EUR',
    currencySymbol: '€',
    language: 'es',
    shipping: {
      domestic: {
        standard: 4.99,
        express: 9.99,
        overnight: 19.99
      },
      international: {
        standard: 14.99,
        express: 29.99
      },
      freeThreshold: 45
    }
  },
  FR: {
    currency: 'EUR',
    currencySymbol: '€',
    language: 'fr',
    shipping: {
      domestic: {
        standard: 4.99,
        express: 9.99,
        overnight: 19.99
      },
      international: {
        standard: 14.99,
        express: 29.99
      },
      freeThreshold: 45
    }
  },
  GB: {
    currency: 'GBP',
    currencySymbol: '£',
    language: 'en',
    shipping: {
      domestic: {
        standard: 3.99,
        express: 7.99,
        overnight: 15.99
      },
      international: {
        standard: 12.99,
        express: 24.99
      },
      freeThreshold: 40
    }
  },
  CA: {
    currency: 'CAD',
    currencySymbol: 'C$',
    language: 'en',
    shipping: {
      domestic: {
        standard: 7.99,
        express: 14.99,
        overnight: 29.99
      },
      international: {
        standard: 24.99,
        express: 49.99
      },
      freeThreshold: 60
    }
  },
  IN: {
    currency: 'INR',
    currencySymbol: '₹',
    language: 'en',
    shipping: {
      domestic: {
        standard: 199,
        express: 399,
        overnight: 799
      },
      international: {
        standard: 1499,
        express: 2999
      },
      freeThreshold: 2000
    }
  },
  AU: {
    currency: 'AUD',
    currencySymbol: 'A$',
    language: 'en',
    shipping: {
      domestic: {
        standard: 8.99,
        express: 15.99,
        overnight: 29.99
      },
      international: {
        standard: 24.99,
        express: 49.99
      },
      freeThreshold: 70
    }
  },
  JP: {
    currency: 'JPY',
    currencySymbol: '¥',
    language: 'en',
    shipping: {
      domestic: {
        standard: 800,
        express: 1500,
        overnight: 3000
      },
      international: {
        standard: 3000,
        express: 6000
      },
      freeThreshold: 8000
    }
  }
};

// Helper function to convert prices
export const convertPrice = (priceUSD, targetCurrency) => {
  const rate = currencyRates[targetCurrency] || 1;
  return (priceUSD * rate).toFixed(2);
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      es: {
        translation: esTranslation
      },
      fr: {
        translation: frTranslation
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
