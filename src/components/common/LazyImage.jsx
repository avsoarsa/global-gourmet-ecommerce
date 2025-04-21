import { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl, getPlaceholderImageUrl } from '../../utils/imageOptimizer';

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  width,
  height,
  threshold = 0.1,
  priority = false,
  quality = 80,
  sizes = '100vw'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // If priority, consider it in view immediately
  const imgRef = useRef(null);

  // Generate optimized image URLs
  const optimizedSrc = getOptimizedImageUrl(src, width || 800, quality);
  const placeholderSrc = getPlaceholderImageUrl(src);

  useEffect(() => {
    // Skip if image is already loaded, is priority, or IntersectionObserver is not supported
    if (isLoaded || priority || !window.IntersectionObserver) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: '200px' // Increased to 200px to load images earlier
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current && observer) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [isLoaded, threshold, priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Generate a placeholder color based on the image src
  const generatePlaceholderColor = () => {
    if (!src) return '#f3f4f6'; // Default gray

    // Simple hash function to generate a color from the src string
    let hash = 0;
    for (let i = 0; i < src.length; i++) {
      hash = src.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert to a pastel color
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 90%)`;
  };

  const placeholderColor = generatePlaceholderColor();

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: width || '100%',
        height: height || '100%',
        backgroundColor: placeholderColor
      }}
    >
      {isInView && (
        <>
          {/* Preload the image if it's priority */}
          {priority && (
            <link
              rel="preload"
              as="image"
              href={optimizedSrc}
              imageSrcSet={`${optimizedSrc} 1x`}
              imageSizes={sizes}
            />
          )}

          <img
            src={optimizedSrc}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            onLoad={handleImageLoad}
            loading={priority ? 'eager' : 'lazy'}
            width={width}
            height={height}
            sizes={sizes}
          />
        </>
      )}

      {!isLoaded && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse ${placeholderClassName}`}
          style={{
            backgroundImage: placeholderSrc ? `url(${placeholderSrc})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Optional: Add a placeholder icon or spinner here */}
        </div>
      )}
    </div>
  );
};

export default LazyImage;
