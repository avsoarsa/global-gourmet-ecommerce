import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTimes,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const BulkEditModal = ({
  isOpen,
  onClose,
  onSave,
  selectedItems,
  fields,
  itemName = 'item'
}) => {
  const [formData, setFormData] = useState({});
  const [activeFields, setActiveFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle field toggle
  const handleFieldToggle = (fieldName) => {
    setActiveFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
    
    // If field is being deactivated, remove it from formData
    if (activeFields[fieldName]) {
      const newFormData = { ...formData };
      delete newFormData[fieldName];
      setFormData(newFormData);
    }
  };
  
  // Handle field change
  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Only include active fields in the update
      const updateData = {};
      Object.keys(activeFields).forEach(fieldName => {
        if (activeFields[fieldName]) {
          updateData[fieldName] = formData[fieldName];
        }
      });
      
      // Check if any fields are active
      if (Object.keys(updateData).length === 0) {
        setError('Please select at least one field to update');
        setIsSubmitting(false);
        return;
      }
      
      // Call the onSave function with the update data
      await onSave(selectedItems, updateData);
      
      // Reset form and close modal
      setFormData({});
      setActiveFields({});
      onClose();
    } catch (error) {
      setError(error.message || 'An error occurred while saving changes');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <FontAwesomeIcon icon={faEdit} className="h-6 w-6 text-green-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Bulk Edit {selectedItems.length} {itemName}{selectedItems.length !== 1 ? 's' : ''}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Select the fields you want to update for all selected {itemName}s. Only the checked fields will be updated.
                  </p>
                </div>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    {fields.map((field) => (
                      <div key={field.name} className="border border-gray-200 rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`toggle-${field.name}`}
                              checked={activeFields[field.name] || false}
                              onChange={() => handleFieldToggle(field.name)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`toggle-${field.name}`} className="ml-2 block text-sm font-medium text-gray-700">
                              {field.label}
                            </label>
                          </div>
                        </div>
                        
                        {activeFields[field.name] && (
                          <div className="mt-2">
                            {field.type === 'text' && (
                              <input
                                type="text"
                                value={formData[field.name] || ''}
                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder={field.placeholder || ''}
                              />
                            )}
                            
                            {field.type === 'number' && (
                              <input
                                type="number"
                                value={formData[field.name] || ''}
                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder={field.placeholder || ''}
                                min={field.min}
                                max={field.max}
                                step={field.step || 1}
                              />
                            )}
                            
                            {field.type === 'select' && (
                              <select
                                value={formData[field.name] || ''}
                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                className="form-select block w-full sm:text-sm border-gray-300 rounded-md"
                              >
                                <option value="">Select {field.label}</option>
                                {field.options.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            )}
                            
                            {field.type === 'checkbox' && (
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`field-${field.name}`}
                                  checked={formData[field.name] || false}
                                  onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`field-${field.name}`} className="ml-2 block text-sm text-gray-700">
                                  {field.checkboxLabel || field.label}
                                </label>
                              </div>
                            )}
                            
                            {field.type === 'textarea' && (
                              <textarea
                                value={formData[field.name] || ''}
                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                className="form-textarea block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder={field.placeholder || ''}
                                rows={field.rows || 3}
                              />
                            )}
                            
                            {field.helpText && (
                              <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                  Save Changes
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkEditModal;
