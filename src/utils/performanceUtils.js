/**
 * Performance optimization utilities
 */

/**
 * Memoize a function to cache its results
 * @param {Function} fn - Function to memoize
 * @param {Function} keyFn - Function to generate cache key (optional)
 * @returns {Function} Memoized function
 */
export const memoize = (fn, keyFn = (...args) => JSON.stringify(args)) => {
  const cache = new Map();
  
  return (...args) => {
    const key = keyFn(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    
    // If result is a promise, handle it properly
    if (result instanceof Promise) {
      return result.then(value => {
        cache.set(key, value);
        return value;
      });
    }
    
    cache.set(key, result);
    return result;
  };
};

/**
 * Create a debounced function that delays invoking fn until after wait milliseconds
 * @param {Function} fn - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export const debounce = (fn, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      fn(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Create a throttled function that only invokes fn at most once per every limit milliseconds
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Milliseconds limit
 * @returns {Function} Throttled function
 */
export const throttle = (fn, limit = 300) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Batch multiple requests into a single request
 * @param {Function} batchFn - Function that handles batched requests
 * @param {Object} options - Configuration options
 * @param {number} options.maxSize - Maximum batch size
 * @param {number} options.maxDelay - Maximum delay in milliseconds
 * @returns {Function} Function that adds items to the batch
 */
export const batchRequests = (batchFn, { maxSize = 10, maxDelay = 50 } = {}) => {
  let batch = [];
  let timer = null;
  
  const processBatch = () => {
    const currentBatch = [...batch];
    batch = [];
    timer = null;
    
    return batchFn(currentBatch);
  };
  
  return (item) => {
    return new Promise((resolve, reject) => {
      const currentIndex = batch.length;
      
      // Add the item and its resolve/reject functions to the batch
      batch.push({
        item,
        resolve,
        reject
      });
      
      // Process immediately if we hit the max size
      if (batch.length >= maxSize) {
        if (timer) {
          clearTimeout(timer);
        }
        
        processBatch()
          .then(results => {
            // Resolve each promise with its corresponding result
            for (let i = 0; i < currentIndex + 1 && i < results.length; i++) {
              batch[i].resolve(results[i]);
            }
          })
          .catch(error => {
            // Reject all promises in the batch
            for (let i = 0; i < currentIndex + 1; i++) {
              batch[i].reject(error);
            }
          });
      } else if (!timer) {
        // Start a timer to process the batch after maxDelay
        timer = setTimeout(() => {
          processBatch()
            .then(results => {
              // Resolve each promise with its corresponding result
              for (let i = 0; i < results.length; i++) {
                batch[i].resolve(results[i]);
              }
            })
            .catch(error => {
              // Reject all promises in the batch
              for (let i = 0; i < batch.length; i++) {
                batch[i].reject(error);
              }
            });
        }, maxDelay);
      }
    });
  };
};

/**
 * Optimize Supabase query by selecting only needed fields
 * @param {Object} query - Supabase query
 * @param {string[]} fields - Fields to select
 * @returns {Object} Optimized query
 */
export const selectFields = (query, fields) => {
  if (!fields || fields.length === 0) {
    return query;
  }
  
  return query.select(fields.join(','));
};

/**
 * Create a paginated query
 * @param {Object} query - Supabase query
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Page size
 * @returns {Object} Paginated query
 */
export const paginate = (query, page = 1, pageSize = 20) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  
  return query.range(start, end);
};

/**
 * Measure execution time of a function
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for logging
 * @returns {Function} Wrapped function
 */
export const measureTime = (fn, label = 'Execution time') => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
    
    return result;
  };
};

export default {
  memoize,
  debounce,
  throttle,
  batchRequests,
  selectFields,
  paginate,
  measureTime
};
