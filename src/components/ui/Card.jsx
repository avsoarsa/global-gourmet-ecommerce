import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component for displaying content in a contained box
 */
export const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  noPadding = false,
  bordered = true,
  shadow = true,
  ...props
}) => {
  // Base classes
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  const shadowClasses = shadow ? 'shadow-sm' : '';
  const borderClasses = bordered ? 'border border-gray-200' : '';
  
  // Combine all classes
  const cardClasses = \`\${baseClasses} \${shadowClasses} \${borderClasses} \${className}\`;
  const bodyClasses = \`\${noPadding ? '' : 'p-4'} \${bodyClassName}\`;
  
  return (
    <div className={cardClasses} {...props}>
      {/* Card Header */}
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 px-4 py-3 ${headerClassName}`}>
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      {/* Card Body */}
      <div className={bodyClasses}>
        {children}
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className={`border-t border-gray-200 px-4 py-3 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  noPadding: PropTypes.bool,
  bordered: PropTypes.bool,
  shadow: PropTypes.bool,
};
