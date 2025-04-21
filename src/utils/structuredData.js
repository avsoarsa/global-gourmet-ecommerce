/**
 * Utility functions for generating structured data (JSON-LD)
 */

/**
 * Generate structured data for the organization
 * @returns {Object} Organization structured data
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Global Gourmet',
    url: 'https://global-gourmet-ecommerce.vercel.app',
    logo: 'https://global-gourmet-ecommerce.vercel.app/logo.png',
    sameAs: [
      'https://facebook.com/globalgourmet',
      'https://twitter.com/globalgourmet',
      'https://instagram.com/globalgourmet'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      availableLanguage: ['English']
    }
  };
};

/**
 * Generate structured data for a product
 * @param {Object} product - Product data
 * @returns {Object} Product structured data
 */
export const generateProductSchema = (product) => {
  if (!product) return null;
  
  // Calculate aggregate rating if available
  const ratingData = product.rating
    ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating.toString(),
          reviewCount: (product.reviews || 0).toString()
        }
      }
    : {};
  
  // Get the default price or first weight option price
  const price = product.weightOptions && product.weightOptions.length > 0
    ? product.weightOptions.find(opt => opt.weight === product.defaultWeight)?.price || product.price
    : product.price;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    sku: `GG-${product.id}`,
    mpn: `GG-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'Global Gourmet'
    },
    offers: {
      '@type': 'Offer',
      url: `https://global-gourmet-ecommerce.vercel.app/product/${product.id}`,
      priceCurrency: 'USD',
      price: price.toString(),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Global Gourmet'
      }
    },
    ...ratingData
  };
};

/**
 * Generate structured data for a breadcrumb list
 * @param {Array} items - Array of breadcrumb items with name and url properties
 * @returns {Object} BreadcrumbList structured data
 */
export const generateBreadcrumbSchema = (items) => {
  if (!items || !items.length) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: (index + 1).toString(),
      name: item.name,
      item: item.url
    }))
  };
};

/**
 * Generate structured data for a FAQ page
 * @param {Array} faqs - Array of FAQ items with question and answer properties
 * @returns {Object} FAQPage structured data
 */
export const generateFAQSchema = (faqs) => {
  if (!faqs || !faqs.length) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};
