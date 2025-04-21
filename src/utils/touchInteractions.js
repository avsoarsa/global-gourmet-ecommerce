/**
 * Utility functions for touch interactions
 */

/**
 * Detect swipe direction from touch events
 * @param {TouchEvent} startEvent - Touch start event
 * @param {TouchEvent} endEvent - Touch end event
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Minimum distance to be considered a swipe (default: 50px)
 * @param {number} options.restraint - Maximum perpendicular distance allowed (default: 100px)
 * @param {number} options.allowedTime - Maximum time allowed for the swipe (default: 300ms)
 * @returns {string|null} - Swipe direction ('left', 'right', 'up', 'down') or null if not a swipe
 */
export const detectSwipe = (startEvent, endEvent, options = {}) => {
  const { 
    threshold = 50, 
    restraint = 100, 
    allowedTime = 300 
  } = options;
  
  const touchStartX = startEvent.touches[0].clientX;
  const touchStartY = startEvent.touches[0].clientY;
  const touchEndX = endEvent.changedTouches[0].clientX;
  const touchEndY = endEvent.changedTouches[0].clientY;
  
  const distX = touchEndX - touchStartX;
  const distY = touchEndY - touchStartY;
  const elapsedTime = endEvent.timeStamp - startEvent.timeStamp;
  
  // Check if the swipe was fast enough
  if (elapsedTime > allowedTime) {
    return null;
  }
  
  // Horizontal swipe
  if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
    return distX > 0 ? 'right' : 'left';
  }
  
  // Vertical swipe
  if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
    return distY > 0 ? 'down' : 'up';
  }
  
  return null;
};

/**
 * Create a swipe handler for React components
 * @param {Object} handlers - Swipe direction handlers
 * @param {Function} handlers.onSwipeLeft - Handler for left swipe
 * @param {Function} handlers.onSwipeRight - Handler for right swipe
 * @param {Function} handlers.onSwipeUp - Handler for up swipe
 * @param {Function} handlers.onSwipeDown - Handler for down swipe
 * @param {Object} options - Configuration options (same as detectSwipe)
 * @returns {Object} - Touch event handlers to spread on a React component
 */
export const useSwipeHandlers = (handlers = {}, options = {}) => {
  const { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown } = handlers;
  
  let touchStartEvent = null;
  
  const handleTouchStart = (e) => {
    touchStartEvent = e;
  };
  
  const handleTouchEnd = (e) => {
    if (!touchStartEvent) return;
    
    const direction = detectSwipe(touchStartEvent, e, options);
    
    if (direction === 'left' && onSwipeLeft) {
      onSwipeLeft(e);
    } else if (direction === 'right' && onSwipeRight) {
      onSwipeRight(e);
    } else if (direction === 'up' && onSwipeUp) {
      onSwipeUp(e);
    } else if (direction === 'down' && onSwipeDown) {
      onSwipeDown(e);
    }
    
    touchStartEvent = null;
  };
  
  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  };
};

/**
 * Add touch feedback to an element (ripple effect)
 * @param {HTMLElement} element - The element to add touch feedback to
 * @param {Object} options - Configuration options
 * @param {string} options.color - Ripple color (default: 'rgba(0, 0, 0, 0.1)')
 * @param {number} options.duration - Animation duration in ms (default: 400)
 */
export const addTouchFeedback = (element, options = {}) => {
  const { 
    color = 'rgba(0, 0, 0, 0.1)', 
    duration = 400 
  } = options;
  
  // Create ripple element
  const ripple = document.createElement('span');
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.backgroundColor = color;
  ripple.style.transform = 'scale(0)';
  ripple.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
  ripple.style.pointerEvents = 'none';
  
  // Add ripple to element
  element.appendChild(ripple);
  
  // Position ripple
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  
  // Trigger animation
  setTimeout(() => {
    ripple.style.transform = 'scale(2)';
    ripple.style.opacity = '0';
  }, 0);
  
  // Remove ripple after animation
  setTimeout(() => {
    ripple.remove();
  }, duration);
};

/**
 * React hook for double tap detection
 * @param {Function} callback - Function to call on double tap
 * @param {number} delay - Maximum delay between taps in ms (default: 300)
 * @returns {Function} - Touch handler to attach to a component
 */
export const useDoubleTap = (callback, delay = 300) => {
  let lastTap = 0;
  
  return (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < delay && tapLength > 0) {
      callback(e);
    }
    
    lastTap = currentTime;
  };
};
