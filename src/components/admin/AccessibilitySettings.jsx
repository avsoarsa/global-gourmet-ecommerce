import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faTextHeight,
  faLowVision,
  faUniversalAccess,
  faKeyboard,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useAccessibility } from '../../context/AccessibilityContext';

/**
 * Component for managing accessibility settings in the admin panel
 */
const AccessibilitySettings = () => {
  const {
    highContrast,
    largeText,
    reducedMotion,
    focusVisible,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleFocusVisible
  } = useAccessibility();
  
  const [activeTab, setActiveTab] = useState('display');
  
  // Toggle switch component
  const ToggleSwitch = ({ checked, onChange, label, description, icon }) => (
    <div className="flex items-start py-4 border-b border-gray-200">
      <div className="flex-shrink-0 mt-1">
        <FontAwesomeIcon icon={icon} className="text-gray-500 h-5 w-5" />
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex items-center justify-between">
          <label htmlFor={`toggle-${label}`} className="text-sm font-medium text-gray-900">
            {label}
          </label>
          <button
            id={`toggle-${label}`}
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              checked ? 'bg-green-600' : 'bg-gray-200'
            }`}
          >
            <span className="sr-only">{label}</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                checked ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FontAwesomeIcon icon={faUniversalAccess} className="mr-2 text-green-600" />
          Accessibility Settings
        </h3>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('display')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'display'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Display
          </button>
          <button
            onClick={() => setActiveTab('navigation')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'navigation'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Navigation
          </button>
        </nav>
      </div>
      
      <div className="p-6">
        {activeTab === 'display' && (
          <div>
            <ToggleSwitch
              checked={highContrast}
              onChange={toggleHighContrast}
              label="High Contrast Mode"
              description="Increases contrast between text and background colors for better readability."
              icon={faLowVision}
            />
            
            <ToggleSwitch
              checked={largeText}
              onChange={toggleLargeText}
              label="Larger Text"
              description="Increases the font size throughout the application for better readability."
              icon={faTextHeight}
            />
            
            <ToggleSwitch
              checked={reducedMotion}
              onChange={toggleReducedMotion}
              label="Reduced Motion"
              description="Minimizes or eliminates animations and transitions."
              icon={faEye}
            />
          </div>
        )}
        
        {activeTab === 'navigation' && (
          <div>
            <ToggleSwitch
              checked={focusVisible}
              onChange={toggleFocusVisible}
              label="Enhanced Focus Indicators"
              description="Makes keyboard focus indicators more visible throughout the application."
              icon={faKeyboard}
            />
            
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Keyboard Navigation Tips</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-blue-500 mt-0.5 mr-2" />
                  Use <kbd className="px-2 py-1 bg-white rounded border border-blue-300 mx-1">Tab</kbd> to navigate between interactive elements
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-blue-500 mt-0.5 mr-2" />
                  Use <kbd className="px-2 py-1 bg-white rounded border border-blue-300 mx-1">Enter</kbd> or <kbd className="px-2 py-1 bg-white rounded border border-blue-300 mx-1">Space</kbd> to activate buttons
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-blue-500 mt-0.5 mr-2" />
                  Use <kbd className="px-2 py-1 bg-white rounded border border-blue-300 mx-1">Esc</kbd> to close modals and dialogs
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-blue-500 mt-0.5 mr-2" />
                  Use <kbd className="px-2 py-1 bg-white rounded border border-blue-300 mx-1">↑</kbd> <kbd className="px-2 py-1 bg-white rounded border border-blue-300 mx-1">↓</kbd> to navigate dropdown menus
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilitySettings;
