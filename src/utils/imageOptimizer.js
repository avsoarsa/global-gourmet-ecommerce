/**
 * Image optimization utility functions
 */

// Default fallback image if an image fails to load
const DEFAULT_FALLBACK_IMAGE = 'https://via.placeholder.com/800x600/f3f4f6/a0aec0?text=Image+Not+Available';

/**
 * Generates a responsive image URL with appropriate size parameters
 * @param {string} url - Original image URL
 * @param {number} width - Desired width
 * @param {number} quality - Image quality (1-100)
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (url, width = 800, quality = 80) => {
  if (!url) return DEFAULT_FALLBACK_IMAGE;

  try {
    // For Unsplash images, we can use their built-in optimization parameters
    if (url.includes('unsplash.com')) {
      // Parse the URL to extract the base and query parameters
      const [baseUrl] = url.split('?');

      // Create a new URL with optimization parameters
      // Use raw.githubusercontent.com to avoid CORS issues
      return `${baseUrl}?w=${width}&q=${quality}&auto=format&fit=crop`;
    }

    // For randomuser.me images (used for testimonials)
    if (url.includes('randomuser.me')) {
      return url; // These are already optimized
    }

    // For placeholder.com images
    if (url.includes('placeholder.com')) {
      return url; // These are already optimized
    }

    // For relative URLs (local images)
    if (url.startsWith('/')) {
      return url; // Local images don't need optimization
    }

    // For all other URLs, return as is
    return url;
  } catch (error) {
    console.error('Error optimizing image URL:', error);
    return DEFAULT_FALLBACK_IMAGE;
  }
};

/**
 * Determines if an image should be lazy loaded based on its position
 * @param {number} index - Index of the image in a list
 * @param {number} threshold - Number of images to eagerly load
 * @returns {boolean} - Whether the image should be lazy loaded
 */
export const shouldLazyLoad = (index, threshold = 3) => {
  return index >= threshold;
};

/**
 * Generates a low-quality placeholder image URL
 * @param {string} url - Original image URL
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImageUrl = (url) => {
  if (!url) return null;

  try {
    if (url.includes('unsplash.com')) {
      // Create a tiny blurred version for placeholder
      const [baseUrl] = url.split('?');
      return `${baseUrl}?w=20&blur=10&q=30`;
    }

    // For other images, return null to use the color placeholder
    return null;
  } catch (error) {
    console.error('Error generating placeholder URL:', error);
    return null;
  }
};

/**
 * Get a fallback image URL if the original fails to load
 * @param {string} originalUrl - The original image URL
 * @param {string} type - Type of image (product, category, user, etc.)
 * @returns {string} - Fallback image URL
 */
export const getFallbackImageUrl = (originalUrl, type = 'general') => {
  const fallbacks = {
    product: 'https://via.placeholder.com/800x600/f3f4f6/a0aec0?text=Product+Image',
    category: 'https://via.placeholder.com/800x600/f3f4f6/a0aec0?text=Category+Image',
    user: 'https://via.placeholder.com/200x200/f3f4f6/a0aec0?text=User',
    recipe: 'https://via.placeholder.com/800x600/f3f4f6/a0aec0?text=Recipe+Image',
    general: DEFAULT_FALLBACK_IMAGE
  };

  return fallbacks[type] || DEFAULT_FALLBACK_IMAGE;
};

/**
 * Preloads critical images
 * @param {Array<string>} urls - Array of image URLs to preload
 */
export const preloadCriticalImages = (urls) => {
  if (!urls || !Array.isArray(urls)) return;

  urls.forEach(url => {
    if (!url) return;

    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getOptimizedImageUrl(url);
      document.head.appendChild(link);
    } catch (error) {
      console.error('Error preloading image:', error);
    }
  });
};
