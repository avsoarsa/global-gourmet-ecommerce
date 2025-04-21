import { useState, useEffect, useRef } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = '',
  width,
  height,
  threshold = 0.1
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  
  useEffect(() => {
    // Skip if image is already loaded or IntersectionObserver is not supported
    if (isLoaded || !window.IntersectionObserver) {
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
        rootMargin: '100px' // Start loading images 100px before they come into view
      }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [isLoaded, threshold]);
  
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
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      )}
      
      {!isLoaded && (
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse ${placeholderClassName}`}
        >
          {/* Optional: Add a placeholder icon or spinner here */}
        </div>
      )}
    </div>
  );
};

export default LazyImage;
