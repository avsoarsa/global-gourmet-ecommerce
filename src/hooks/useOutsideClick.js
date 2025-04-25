import { useEffect, useRef } from 'react';

/**
 * Custom hook for detecting clicks outside of a specified element
 * @param {Function} callback - Function to call when a click outside is detected
 * @returns {React.RefObject} - Ref to attach to the element
 */
export const useOutsideClick = (callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};
