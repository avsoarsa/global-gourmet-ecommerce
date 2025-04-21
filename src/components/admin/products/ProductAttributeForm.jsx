import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faGripLines,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const ProductAttributeForm = ({ 
  attributes = [], 
  onChange,
  onAddAttribute,
  onRemoveAttribute
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  // Handle attribute change
  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [field]: value
    };
    
    onChange(updatedAttributes);
  };
  
  // Add option to attribute
  const addOption = (attributeIndex) => {
    const updatedAttributes = [...attributes];
    
    // Initialize options array if it doesn't exist
    if (!updatedAttributes[attributeIndex].options) {
      updatedAttributes[attributeIndex].options = [];
    }
    
    updatedAttributes[attributeIndex].options.push({
      value: '',
      label: ''
    });
    
    onChange(updatedAttributes);
  };
  
  // Remove option from attribute
  const removeOption = (attributeIndex, optionIndex) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[attributeIndex].options.splice(optionIndex, 1);
    onChange(updatedAttributes);
  };
  
  // Handle option change
  const handleOptionChange = (attributeIndex, optionIndex, field, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[attributeIndex].options[optionIndex] = {
      ...updatedAttributes[attributeIndex].options[optionIndex],
      [field]: value
    };
    
    onChange(updatedAttributes);
  };
  
  // Add new attribute
  const addAttribute = () => {
    const newAttribute = {
      key: `attr_${Date.now()}`,
      name: '',
      type: 'text',
      options: []
    };
    
    onAddAttribute(newAttribute);
  };
  
  // Remove attribute
  const removeAttribute = (index) => {
    onRemoveAttribute(index);
  };
  
  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox
    e.dataTransfer.setData('text/plain', index);
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    
    if (draggedIndex === null) return;
    if (draggedIndex === index) return;
    
    const updatedAttributes = [...attributes];
    const draggedAttribute = updatedAttributes[draggedIndex];
    
    // Remove the dragged item
    updatedAttributes.splice(draggedIndex, 1);
    // Insert it at the new position
    updatedAttributes.splice(index, 0, draggedAttribute);
    
    // Update the dragged index
    setDraggedIndex(index);
    
    // Update the attributes
    onChange(updatedAttributes);
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Product Attributes</h3>
        <button
          type="button"
          onClick={addAttribute}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
          Add Attribute
        </button>
      </div>
      
      {attributes.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-gray-500">No attributes added yet. Click "Add Attribute" to create your first attribute.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {attributes.map((attribute, index) => (
            <div 
              key={attribute.key}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="border border-gray-200 rounded-md p-4 bg-white"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="cursor-move text-gray-400 mr-2">
                    <FontAwesomeIcon icon={faGripLines} />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {attribute.name || `Attribute ${index + 1}`}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttribute(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`attribute-${index}-name`} className="block text-sm font-medium text-gray-700 mb-1">
                    Attribute Name
                  </label>
                  <input
                    type="text"
                    id={`attribute-${index}-name`}
                    value={attribute.name || ''}
                    onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                    className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g. Size, Color, Material"
                  />
                </div>
                
                <div>
                  <label htmlFor={`attribute-${index}-type`} className="block text-sm font-medium text-gray-700 mb-1">
                    Attribute Type
                  </label>
                  <select
                    id={`attribute-${index}-type`}
                    value={attribute.type || 'text'}
                    onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
                    className="form-select block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="text">Text</option>
                    <option value="select">Select (Dropdown)</option>
                  </select>
                </div>
              </div>
              
              {/* Options for select type */}
              {attribute.type === 'select' && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-medium text-gray-700">Options</h5>
                    <button
                      type="button"
                      onClick={() => addOption(index)}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-1" />
                      Add Option
                    </button>
                  </div>
                  
                  {(!attribute.options || attribute.options.length === 0) ? (
                    <div className="bg-gray-50 p-3 rounded-md text-center">
                      <p className="text-xs text-gray-500">No options added yet. Click "Add Option" to create your first option.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {attribute.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={option.value || ''}
                            onChange={(e) => handleOptionChange(index, optionIndex, 'value', e.target.value)}
                            className="form-input block w-1/3 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Value (e.g. red)"
                          />
                          <input
                            type="text"
                            value={option.label || ''}
                            onChange={(e) => handleOptionChange(index, optionIndex, 'label', e.target.value)}
                            className="form-input block w-1/2 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Label (e.g. Red)"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(index, optionIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductAttributeForm;
