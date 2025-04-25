import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

/**
 * Button variants
 */
const VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  DANGER: 'danger',
  SUCCESS: 'success',
};

/**
 * Button sizes
 */
const SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

/**
 * Button component with multiple variants and sizes
 */
export const Button = forwardRef(({
  children,
  variant = VARIANTS.PRIMARY,
  size = SIZES.MEDIUM,
  icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  href,
  to,
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500';

  // Size classes
  const sizeClasses = {
    [SIZES.SMALL]: 'px-3 py-1.5 text-sm rounded',
    [SIZES.MEDIUM]: 'px-4 py-2 text-base rounded-md',
    [SIZES.LARGE]: 'px-6 py-3 text-lg rounded-md',
  };

  // Variant classes
  const variantClasses = {
    [VARIANTS.PRIMARY]: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300',
    [VARIANTS.SECONDARY]: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400',
    [VARIANTS.OUTLINE]: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white',
    [VARIANTS.GHOST]: 'text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white',
    [VARIANTS.DANGER]: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
    [VARIANTS.SUCCESS]: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300',
  };

  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${className}`;

  // Content with icon and loading state
  const content = (
    <>
      {isLoading && (
        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
      )}

      {!isLoading && icon && iconPosition === 'left' && (
        <FontAwesomeIcon icon={icon} className="mr-2" />
      )}

      {children}

      {!isLoading && icon && iconPosition === 'right' && (
        <FontAwesomeIcon icon={icon} className="ml-2" />
      )}
    </>
  );

  // If it's a link (internal)
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        ref={ref}
        {...props}
      >
        {content}
      </Link>
    );
  }

  // If it's a link (external)
  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        ref={ref}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {content}
      </a>
    );
  }

  // Regular button
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      onClick={onClick}
      ref={ref}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(Object.values(VARIANTS)),
  size: PropTypes.oneOf(Object.values(SIZES)),
  icon: PropTypes.object,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  href: PropTypes.string,
  to: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

// Export variants and sizes
Button.VARIANTS = VARIANTS;
Button.SIZES = SIZES;
