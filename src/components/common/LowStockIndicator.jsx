import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const LowStockIndicator = ({ stock, threshold = 10, showCount = true }) => {
  const [isLowStock, setIsLowStock] = useState(false);
  const [stockLevel, setStockLevel] = useState(stock);
  
  // Determine if stock is low
  useEffect(() => {
    // If stock is not provided, don't show the indicator
    if (stock === undefined || stock === null) {
      setIsLowStock(false);
      return;
    }
    
    // Check if stock is below threshold
    setIsLowStock(stock <= threshold);
    setStockLevel(stock);
  }, [stock, threshold]);
  
  // Don't render if not low stock
  if (!isLowStock) return null;
  
  return (
    <div className="flex items-center text-amber-600 text-sm mt-2 animate-pulse">
      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
      <span>
        {showCount 
          ? `Only ${stockLevel} left in stock - order soon!` 
          : 'Low stock - order soon!'}
      </span>
    </div>
  );
};

export default LowStockIndicator;
