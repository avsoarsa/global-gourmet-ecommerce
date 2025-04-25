import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faCheckCircle,
  faExclamationTriangle,
  faExclamationCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Alert variants
 */
const VARIANTS = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

/**
 * Alert component for displaying messages
 */
export const Alert = ({
  children,
  variant = VARIANTS.INFO,
  title,
  icon,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'p-4 rounded-md';

  // Variant classes
  const variantClasses = {
    [VARIANTS.INFO]: 'bg-blue-50 text-blue-800',
    [VARIANTS.SUCCESS]: 'bg-green-50 text-green-800',
    [VARIANTS.WARNING]: 'bg-yellow-50 text-yellow-800',
    [VARIANTS.ERROR]: 'bg-red-50 text-red-800',
  };

  // Default icons
  const defaultIcons = {
    [VARIANTS.INFO]: faInfoCircle,
    [VARIANTS.SUCCESS]: faCheckCircle,
    [VARIANTS.WARNING]: faExclamationTriangle,
    [VARIANTS.ERROR]: faExclamationCircle,
  };

  // Icon colors
  const iconColors = {
    [VARIANTS.INFO]: 'text-blue-500',
    [VARIANTS.SUCCESS]: 'text-green-500',
    [VARIANTS.WARNING]: 'text-yellow-500',
    [VARIANTS.ERROR]: 'text-red-500',
  };

  // Combine all classes
  const alertClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  // Use provided icon or default for the variant
  const alertIcon = icon || defaultIcons[variant];

  return (
    <div className={alertClasses} role="alert" {...props}>
      <div className="flex">
        {alertIcon && (
          <div className="flex-shrink-0">
            <FontAwesomeIcon icon={alertIcon} className={`h-5 w-5 ${iconColors[variant]}`} />
          </div>
        )}

        <div className={`${alertIcon ? 'ml-3' : ''} flex-1`}>
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}

          <div className={`${title ? 'mt-2' : ''} text-sm`}>
            {children}
          </div>
        </div>

        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  variant === VARIANTS.INFO ? 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600' :
                  variant === VARIANTS.SUCCESS ? 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600' :
                  variant === VARIANTS.WARNING ? 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' :
                  'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600'
                }`}
                onClick={onDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(Object.values(VARIANTS)),
  title: PropTypes.string,
  icon: PropTypes.object,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  className: PropTypes.string,
};

// Export variants
Alert.VARIANTS = VARIANTS;
