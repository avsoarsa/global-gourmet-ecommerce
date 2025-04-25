import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Tab variants
 */
const VARIANTS = {
  DEFAULT: 'default',
  PILLS: 'pills',
  UNDERLINE: 'underline',
};

/**
 * Tab component for organizing content into multiple sections
 */
export const Tabs = ({
  tabs,
  activeTab: controlledActiveTab,
  onChange,
  variant = VARIANTS.DEFAULT,
  className = '',
  tabsClassName = '',
  contentClassName = '',
  ...props
}) => {
  // Use controlled or uncontrolled state
  const [activeTab, setActiveTab] = useState(controlledActiveTab || tabs[0]?.id);

  // Update internal state when controlled prop changes
  useEffect(() => {
    if (controlledActiveTab !== undefined) {
      setActiveTab(controlledActiveTab);
    }
  }, [controlledActiveTab]);

  // Handle tab change
  const handleTabChange = (tabId) => {
    if (controlledActiveTab === undefined) {
      setActiveTab(tabId);
    }

    if (onChange) {
      onChange(tabId);
    }
  };

  // Variant classes
  const variantClasses = {
    [VARIANTS.DEFAULT]: {
      tabs: 'flex space-x-4 border-b border-gray-200',
      tab: (isActive) => `px-3 py-2 text-sm font-medium ${
        isActive
          ? 'border-b-2 border-green-500 text-green-600'
          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`,
    },
    [VARIANTS.PILLS]: {
      tabs: 'flex space-x-2',
      tab: (isActive) => `px-3 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'bg-green-100 text-green-700'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`,
    },
    [VARIANTS.UNDERLINE]: {
      tabs: 'flex space-x-8',
      tab: (isActive) => `pb-2 text-sm font-medium border-b-2 ${
        isActive
          ? 'border-green-500 text-green-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`,
    },
  };

  return (
    <div className={className} {...props}>
      {/* Tabs */}
      <div className={`${variantClasses[variant].tabs} ${tabsClassName}`} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={variantClasses[variant].tab(activeTab === tab.id)}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.icon && (
              <span className="mr-2">{tab.icon}</span>
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`mt-4 ${contentClassName}`}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            id={`tab-panel-${tab.id}`}
            className={activeTab === tab.id ? '' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      content: PropTypes.node.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
  activeTab: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(Object.values(VARIANTS)),
  className: PropTypes.string,
  tabsClassName: PropTypes.string,
  contentClassName: PropTypes.string,
};

// Export variants
Tabs.VARIANTS = VARIANTS;
