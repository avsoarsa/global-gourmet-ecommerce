import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSort, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

/**
 * Mobile-optimized filter and sort component similar to Amazon/Flipkart
 */
const MobileFilterSort = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Customer Rating' }
  ],
  selectedSort = 'featured',
  onSortChange
}) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [tempCategory, setTempCategory] = useState(selectedCategory);
  const [tempSort, setTempSort] = useState(selectedSort);

  const handleFilterApply = () => {
    onCategoryChange(tempCategory);
    setShowFilterModal(false);
  };

  const handleSortApply = () => {
    onSortChange(tempSort);
    setShowSortModal(false);
  };

  return (
    <>
      {/* Mobile Filter/Sort Bar */}
      <div className="sticky top-16 z-20 bg-white border-b border-gray-200 md:hidden">
        <div className="flex justify-between">
          <button 
            className="flex-1 py-3 flex items-center justify-center gap-2 border-r border-gray-200"
            onClick={() => setShowFilterModal(true)}
          >
            <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
            <span className="font-medium text-gray-800">Filter</span>
          </button>
          <button 
            className="flex-1 py-3 flex items-center justify-center gap-2"
            onClick={() => setShowSortModal(true)}
          >
            <FontAwesomeIcon icon={faSort} className="text-gray-600" />
            <span className="font-medium text-gray-800">Sort</span>
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowFilterModal(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[80vh] overflow-y-auto mobile-modal">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Filter Products</h3>
              <button onClick={() => setShowFilterModal(false)} className="text-gray-500">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="p-4">
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                <div 
                  className={`p-3 rounded-lg flex items-center justify-between ${tempCategory === 'All Products' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}
                  onClick={() => setTempCategory('All Products')}
                >
                  <span>All Products</span>
                  {tempCategory === 'All Products' && (
                    <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                  )}
                </div>
                
                {categories.slice(1).map(category => (
                  <div 
                    key={category.id}
                    className={`p-3 rounded-lg flex items-center justify-between ${tempCategory === category.name ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}
                    onClick={() => setTempCategory(category.name)}
                  >
                    <span>{category.name}</span>
                    {tempCategory === category.name && (
                      <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
              <button 
                onClick={() => setShowFilterModal(false)} 
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleFilterApply} 
                className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sort Modal */}
      {showSortModal && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSortModal(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[80vh] overflow-y-auto mobile-modal">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Sort By</h3>
              <button onClick={() => setShowSortModal(false)} className="text-gray-500">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {sortOptions.map(option => (
                  <div 
                    key={option.value}
                    className={`p-3 rounded-lg flex items-center justify-between ${tempSort === option.value ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}
                    onClick={() => setTempSort(option.value)}
                  >
                    <span>{option.label}</span>
                    {tempSort === option.value && (
                      <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
              <button 
                onClick={() => setShowSortModal(false)} 
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleSortApply} 
                className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilterSort;
