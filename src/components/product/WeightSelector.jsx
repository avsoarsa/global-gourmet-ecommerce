import { useState, useEffect } from 'react';
import { useRegion } from '../../context/RegionContext';

const WeightSelector = ({
  weightOptions,
  defaultWeight,
  onWeightChange,
  selectedWeight,
  className = ''
}) => {
  const [selected, setSelected] = useState(selectedWeight || defaultWeight || (weightOptions.length > 0 ? weightOptions[0].weight : null));
  const { convertPriceSync, currencySymbol } = useRegion();

  // Update selected weight when props change
  useEffect(() => {
    if (selectedWeight && selectedWeight !== selected) {
      setSelected(selectedWeight);
    } else if (!selectedWeight && defaultWeight && defaultWeight !== selected) {
      setSelected(defaultWeight);
    }
  }, [selectedWeight, defaultWeight, selected]);

  // Handle weight selection
  const handleWeightSelect = (weight) => {
    setSelected(weight);
    if (onWeightChange) {
      const option = weightOptions.find(opt => opt.weight === weight);
      onWeightChange(weight, option);
    }
  };

  // If no weight options, don't render anything
  if (!weightOptions || weightOptions.length === 0) {
    return null;
  }

  // Get the selected weight option
  const selectedOption = weightOptions.find(opt => opt.weight === selected) || weightOptions[0];

  return (
    <div className={`${className}`}>
      <div className="flex flex-col space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Weight
        </label>
        <div className="flex flex-wrap gap-2">
          {weightOptions.map((option) => (
            <button
              key={option.weight}
              type="button"
              onClick={() => handleWeightSelect(option.weight)}
              disabled={!option.inStock}
              className={`
                px-3 py-2 text-sm font-medium rounded-md
                ${selected === option.weight
                  ? 'bg-green-600 text-white ring-2 ring-offset-2 ring-green-500'
                  : option.inStock
                    ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }
                focus:outline-none transition-colors duration-200
              `}
            >
              <span className="flex flex-col items-center">
                <span>{option.weight}</span>
                <span className="text-xs mt-1">
                  {option.inStock
                    ? `${currencySymbol}${typeof convertPriceSync(option.price) === 'number' ? convertPriceSync(option.price).toFixed(2) : '0.00'}`
                    : 'Out of Stock'
                  }
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeightSelector;
