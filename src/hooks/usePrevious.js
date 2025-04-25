import { useEffect, useRef } from 'react';

/**
 * Custom hook for accessing the previous value of a state or prop
 * @param {any} value - The value to track
 * @returns {any} - The previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};
