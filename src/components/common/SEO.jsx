import { Helmet } from 'react-helmet';

/**
 * SEO component for managing all document head changes
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.canonicalUrl - Canonical URL
 * @param {string} props.ogType - Open Graph type (default: 'website')
 * @param {string} props.ogImage - Open Graph image URL
 * @param {Array} props.keywords - Array of keywords
 * @param {Object} props.structuredData - Structured data for rich snippets (JSON-LD)
 */
const SEO = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  keywords = [],
  structuredData = null,
}) => {
  // Default values
  const defaultTitle = 'Global Gourmet | Premium Dry Fruits & Spices';
  const defaultDescription = 'Discover premium quality dry fruits, spices, nuts, and superfoods at Global Gourmet. Ethically sourced, fresh, and delivered to your doorstep.';
  const defaultOgImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop';
  const siteUrl = 'https://global-gourmet-ecommerce.vercel.app';
  
  // Use provided values or defaults
  const metaTitle = title ? `${title} | Global Gourmet` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaImage = ogImage || defaultOgImage;
  const metaUrl = canonicalUrl || siteUrl;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={metaUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {/* Structured data for rich snippets */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
