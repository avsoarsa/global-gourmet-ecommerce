import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTimes,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faColumns,
  faLayerGroup
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
  const [activeTab, setActiveTab] = useState('basic');
  const [advancedMode, setAdvancedMode] = useState(false);

  // Group fields by category
  const fieldGroups = {
    basic: fields.filter(field => !field.category || field.category === 'basic'),
    pricing: fields.filter(field => field.category === 'pricing'),
    inventory: fields.filter(field => field.category === 'inventory'),
    attributes: fields.filter(field => field.category === 'attributes'),
    seo: fields.filter(field => field.category === 'seo')
  };

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setFormData({});
      setActiveFields({});
      setError(null);
      setActiveTab('basic');
      setAdvancedMode(false);
    }
  }, [isOpen]);

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

  // Toggle advanced mode
  const toggleAdvancedMode = () => {
    setAdvancedMode(!advancedMode);
  };

  // Select all fields in a category
  const selectAllInCategory = (category) => {
    const categoryFields = fieldGroups[category];
    const newActiveFields = { ...activeFields };

    categoryFields.forEach(field => {
      newActiveFields[field.name] = true;
    });

    setActiveFields(newActiveFields);
  };

  // Deselect all fields in a category
  const deselectAllInCategory = (category) => {
    const categoryFields = fieldGroups[category];
    const newActiveFields = { ...activeFields };
    const newFormData = { ...formData };

    categoryFields.forEach(field => {
      newActiveFields[field.name] = false;
      delete newFormData[field.name];
    });

    setActiveFields(newActiveFields);
    setFormData(newFormData);
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

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <FontAwesomeIcon icon={faEdit} className="h-6 w-6 text-green-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Bulk Edit {selectedItems.length} {itemName}{selectedItems.length !== 1 ? 's' : ''}
                  </h3>
                  <button
                    type="button"
                    onClick={toggleAdvancedMode}
                    className="text-sm text-green-600 hover:text-green-800 flex items-center"
                  >
                    <FontAwesomeIcon icon={faColumns} className="mr-1" />
                    {advancedMode ? 'Simple Mode' : 'Advanced Mode'}
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Select the fields you want to update for all selected {itemName}s. Only the checked fields will be updated.
                  </p>
                </div>

                {/* Tabs for advanced mode */}
                {advancedMode && (
                  <div className="mt-4 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                      {Object.entries(fieldGroups).map(([key, groupFields]) => {
                        if (groupFields.length === 0) return null;

                        return (
                          <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`${activeTab === key
                              ? 'border-green-500 text-green-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                            {Object.keys(activeFields).some(field =>
                              groupFields.some(f => f.name === field && activeFields[field])
                            ) && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold rounded-full px-2 py-0.5">
                                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                )}

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
                  {advancedMode && (
                    <div className="mb-4 flex justify-between items-center">
                      <div>
                        <button
                          type="button"
                          onClick={() => selectAllInCategory(activeTab)}
                          className="text-sm text-green-600 hover:text-green-800 mr-4"
                        >
                          Select All in {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </button>
                        <button
                          type="button"
                          onClick={() => deselectAllInCategory(activeTab)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Deselect All
                        </button>
                      </div>
                      <div className="text-sm text-gray-500">
                        {Object.keys(activeFields).filter(key => activeFields[key]).length} fields selected
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {(advancedMode ? fieldGroups[activeTab] : fields).map((field) => (
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
                            {field.category && !advancedMode && (
                              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {field.category}
                              </span>
                            )}
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

            {/* Summary of changes */}
            <div className="mt-3 mr-auto text-sm text-gray-500">
              {Object.keys(activeFields).filter(key => activeFields[key]).length} fields will be updated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkEditModal;
