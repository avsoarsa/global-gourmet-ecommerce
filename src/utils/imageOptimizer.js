/**
 * Image optimization utility functions
 */

/**
 * Generates a responsive image URL with appropriate size parameters
 * @param {string} url - Original image URL
 * @param {number} width - Desired width
 * @param {number} quality - Image quality (1-100)
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (url, width = 800, quality = 80) => {
  // For Unsplash images, we can use their built-in optimization parameters
  if (url.includes('unsplash.com')) {
    // Parse the URL to extract the base and query parameters
    const [baseUrl, queryParams] = url.split('?');
    
    // Create a new URL with optimization parameters
    const optimizedUrl = `${baseUrl}?w=${width}&q=${quality}&auto=format&fit=crop`;
    return optimizedUrl;
  }
  
  // For other image sources, return the original URL
  // In a real app, you might use a CDN or image optimization service
  return url;
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
  if (url.includes('unsplash.com')) {
    // Create a tiny blurred version for placeholder
    const [baseUrl] = url.split('?');
    return `${baseUrl}?w=20&blur=10&q=30`;
  }
  
  return url;
};

/**
 * Preloads critical images
 * @param {Array<string>} urls - Array of image URLs to preload
 */
export const preloadCriticalImages = (urls) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};
