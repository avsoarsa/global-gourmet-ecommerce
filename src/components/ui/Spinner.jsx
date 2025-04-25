import React from 'react';
import PropTypes from 'prop-types';

/**
 * Spinner sizes
 */
const SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

/**
 * Spinner component for loading states
 */
export const Spinner = ({
  size = SIZES.MEDIUM,
  color = 'green',
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    [SIZES.SMALL]: 'w-4 h-4 border-2',
    [SIZES.MEDIUM]: 'w-8 h-8 border-3',
    [SIZES.LARGE]: 'w-12 h-12 border-4',
  };

  // Color classes
  const colorClasses = {
    green: 'border-green-600',
    blue: 'border-blue-600',
    red: 'border-red-600',
    yellow: 'border-yellow-600',
    gray: 'border-gray-600',
    white: 'border-white',
  };

  // Combine all classes
  const spinnerClasses = `animate-spin rounded-full border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  return (
    <div className={spinnerClasses} {...props}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(Object.values(SIZES)),
  color: PropTypes.oneOf(['green', 'blue', 'red', 'yellow', 'gray', 'white']),
  className: PropTypes.string,
};

// Export sizes
Spinner.SIZES = SIZES;
