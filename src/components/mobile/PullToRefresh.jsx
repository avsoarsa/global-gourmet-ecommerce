import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faSpinner } from '@fortawesome/free-solid-svg-icons';

const PullToRefresh = ({ onRefresh, children, threshold = 80, maxPull = 120 }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const isTouchActiveRef = useRef(false);

  // Handle touch start
  const handleTouchStart = (e) => {
    // Only activate pull-to-refresh when at the top of the page
    if (window.scrollY === 0) {
      startYRef.current = e.touches[0].clientY;
      isTouchActiveRef.current = true;
      setIsPulling(true);
    }
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    if (!isTouchActiveRef.current) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    // Only allow pulling down
    if (diff > 0) {
      // Calculate pull distance with resistance
      const newPullDistance = Math.min(diff * 0.5, maxPull);
      setPullDistance(newPullDistance);

      // Prevent default scrolling behavior when pulling
      if (newPullDistance > 0) {
        e.preventDefault();
      }
    }
  };

  // Handle touch end
  const handleTouchEnd = async () => {
    if (!isTouchActiveRef.current) return;

    isTouchActiveRef.current = false;

    // If pulled past threshold, trigger refresh
    if (pullDistance >= threshold) {
      setIsRefreshing(true);

      try {
        await onRefresh();
        setIsSuccess(true);

        // Reset success state after a delay
        setTimeout(() => {
          setIsSuccess(false);
          setPullDistance(0);
          setIsRefreshing(false);
        }, 1000);
      } catch (error) {
        console.error('Refresh failed:', error);
        setPullDistance(0);
        setIsRefreshing(false);
      }
    } else {
      // Not pulled enough, reset
      setPullDistance(0);
    }

    setIsPulling(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [pullDistance, threshold]);

  // Calculate progress percentage
  const progress = Math.min((pullDistance / threshold) * 100, 100);

  return (
    <div ref={containerRef} className="relative">
      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 flex justify-center items-center overflow-hidden transition-all z-10"
        style={{
          height: `${pullDistance}px`,
          top: 0,
          transform: `translateY(-100%) translateY(${pullDistance}px)`
        }}
      >
        <div className="bg-white rounded-full shadow-md w-12 h-12 flex items-center justify-center">
          {isRefreshing ? (
            <FontAwesomeIcon icon={faSpinner} className="text-green-600 animate-spin" />
          ) : isSuccess ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <FontAwesomeIcon
              icon={faArrowDown}
              className="text-gray-600 transition-transform"
              style={{
                transform: `rotate(${180 * (progress / 100)}deg)`,
                opacity: progress / 100
              }}
            />
          )}
        </div>
      </div>

      {/* Content container */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
