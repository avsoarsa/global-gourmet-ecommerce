import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, 
  faFileExcel, 
  faFileCsv, 
  faChevronDown 
} from '@fortawesome/free-solid-svg-icons';
import { exportData } from '../../utils/exportUtils';

const ExportButton = ({ 
  data, 
  headers, 
  filename = 'export',
  label = 'Export',
  className = '',
  dropdownPosition = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  
  // Add event listener when dropdown is open
  if (isOpen) {
    window.addEventListener('click', handleClickOutside);
  } else {
    window.removeEventListener('click', handleClickOutside);
  }
  
  // Handle export
  const handleExport = (format) => {
    exportData(data, headers, filename, format);
    setIsOpen(false);
  };
  
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${className}`}
      >
        <FontAwesomeIcon icon={faDownload} className="mr-2" />
        {label}
        <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
      </button>
      
      {isOpen && (
        <div 
          className={`origin-top-${dropdownPosition} absolute ${dropdownPosition}-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={() => handleExport('csv')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
              role="menuitem"
            >
              <FontAwesomeIcon icon={faFileCsv} className="mr-3 text-green-600" />
              Export as CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
              role="menuitem"
            >
              <FontAwesomeIcon icon={faFileExcel} className="mr-3 text-green-600" />
              Export as Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
