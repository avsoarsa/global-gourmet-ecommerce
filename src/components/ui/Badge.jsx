import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge variants
 */
const VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * Badge sizes
 */
const SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

/**
 * Badge component for displaying short information
 */
export const Badge = ({
  children,
  variant = VARIANTS.PRIMARY,
  size = SIZES.MEDIUM,
  rounded = false,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center font-medium';

  // Size classes
  const sizeClasses = {
    [SIZES.SMALL]: 'px-2 py-0.5 text-xs',
    [SIZES.MEDIUM]: 'px-2.5 py-0.5 text-sm',
    [SIZES.LARGE]: 'px-3 py-1 text-base',
  };

  // Variant classes
  const variantClasses = {
    [VARIANTS.PRIMARY]: 'bg-green-100 text-green-800',
    [VARIANTS.SECONDARY]: 'bg-gray-100 text-gray-800',
    [VARIANTS.SUCCESS]: 'bg-green-100 text-green-800',
    [VARIANTS.DANGER]: 'bg-red-100 text-red-800',
    [VARIANTS.WARNING]: 'bg-yellow-100 text-yellow-800',
    [VARIANTS.INFO]: 'bg-blue-100 text-blue-800',
  };

  // Rounded classes
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';

  // Combine all classes
  const badgeClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${roundedClasses} ${className}`;

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(Object.values(VARIANTS)),
  size: PropTypes.oneOf(Object.values(SIZES)),
  rounded: PropTypes.bool,
  className: PropTypes.string,
};

// Export variants and sizes
Badge.VARIANTS = VARIANTS;
Badge.SIZES = SIZES;
