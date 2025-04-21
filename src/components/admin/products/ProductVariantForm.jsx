import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faGripLines,
  faImage
} from '@fortawesome/free-solid-svg-icons';

const ProductVariantForm = ({
  variants = [],
  attributes = [],
  onChange,
  onAddVariant,
  onRemoveVariant
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Handle variant change
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };

    onChange(updatedVariants);
  };

  // Handle attribute value change
  const handleAttributeValueChange = (variantIndex, attributeKey, value) => {
    const updatedVariants = [...variants];

    // Initialize attributes object if it doesn't exist
    if (!updatedVariants[variantIndex].attributes) {
      updatedVariants[variantIndex].attributes = {};
    }

    updatedVariants[variantIndex].attributes = {
      ...updatedVariants[variantIndex].attributes,
      [attributeKey]: value
    };

    onChange(updatedVariants);
  };

  // Add new variant
  const addVariant = () => {
    const newVariant = {
      sku: '',
      price: '',
      originalPrice: '',
      discount: 0,
      stock: '',
      image: '',
      hsCode: '',
      attributes: {}
    };

    // Initialize with empty values for all attributes
    attributes.forEach(attr => {
      newVariant.attributes[attr.key] = '';
    });

    onAddVariant(newVariant);
  };

  // Remove variant
  const removeVariant = (index) => {
    onRemoveVariant(index);
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

    const updatedVariants = [...variants];
    const draggedVariant = updatedVariants[draggedIndex];

    // Remove the dragged item
    updatedVariants.splice(draggedIndex, 1);
    // Insert it at the new position
    updatedVariants.splice(index, 0, draggedVariant);

    // Update the dragged index
    setDraggedIndex(index);

    // Update the variants
    onChange(updatedVariants);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
        <button
          type="button"
          onClick={addVariant}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
          Add Variant
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-gray-500">No variants added yet. Click "Add Variant" to create your first variant.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div
              key={index}
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
                  <h4 className="text-sm font-medium text-gray-900">Variant {index + 1}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`variant-${index}-sku`} className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    id={`variant-${index}-sku`}
                    value={variant.sku || ''}
                    onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                    className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="SKU-001"
                  />
                </div>

                <div>
                  <label htmlFor={`variant-${index}-price`} className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    id={`variant-${index}-price`}
                    value={variant.price || ''}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                    className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor={`variant-${index}-originalPrice`} className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price (MRP)
                  </label>
                  <input
                    type="number"
                    id={`variant-${index}-originalPrice`}
                    value={variant.originalPrice || ''}
                    onChange={(e) => handleVariantChange(index, 'originalPrice', e.target.value)}
                    className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label htmlFor={`variant-${index}-discount`} className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    id={`variant-${index}-discount`}
                    value={variant.discount || 0}
                    onChange={(e) => handleVariantChange(index, 'discount', e.target.value)}
                    className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="0"
                    min="0"
                    max="99"
                    step="1"
                  />
                </div>

                <div>
                  <label htmlFor={`variant-${index}-stock`} className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    id={`variant-${index}-stock`}
                    value={variant.stock || ''}
                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                    className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`variant-${index}-hsCode`} className="block text-sm font-medium text-gray-700 mb-1">
                    HS Code
                  </label>
                  <input
                    type="text"
                    id={`variant-${index}-hsCode`}
                    value={variant.hsCode || ''}
                    onChange={(e) => handleVariantChange(index, 'hsCode', e.target.value)}
                    className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g. 0802.90.10"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Harmonized System code for customs
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label htmlFor={`variant-${index}-image`} className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id={`variant-${index}-image`}
                    value={variant.image || ''}
                    onChange={(e) => handleVariantChange(index, 'image', e.target.value)}
                    className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {variant.image && (
                <div className="mb-4">
                  <div className="mt-1 flex items-center">
                    <div className="w-16 h-16 border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                      <img
                        src={variant.image}
                        alt={`Variant ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Attributes */}
              {attributes.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Attributes</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {attributes.map((attribute) => (
                      <div key={attribute.key}>
                        <label
                          htmlFor={`variant-${index}-attr-${attribute.key}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {attribute.name}
                        </label>

                        {attribute.type === 'select' && attribute.options ? (
                          <select
                            id={`variant-${index}-attr-${attribute.key}`}
                            value={variant.attributes?.[attribute.key] || ''}
                            onChange={(e) => handleAttributeValueChange(index, attribute.key, e.target.value)}
                            className="form-select block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="">Select {attribute.name}</option>
                            {attribute.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            id={`variant-${index}-attr-${attribute.key}`}
                            value={variant.attributes?.[attribute.key] || ''}
                            onChange={(e) => handleAttributeValueChange(index, attribute.key, e.target.value)}
                            className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder={`Enter ${attribute.name}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductVariantForm;
