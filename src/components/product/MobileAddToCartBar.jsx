import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const MobileAddToCartBar = ({ 
  product, 
  selectedWeightOption, 
  currencySymbol, 
  convertPriceSync, 
  handleAddToCart 
}) => {
  // Calculate the current price based on selected weight option
  const currentPrice = selectedWeightOption ? selectedWeightOption.price : product.price;
  const formattedPrice = (() => {
    const price = convertPriceSync(currentPrice);
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  })();

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center justify-between z-50 md:hidden mobile-add-to-cart-bar">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">Price:</span>
        <span className="text-base font-bold text-green-700">
          {currencySymbol}{formattedPrice}
        </span>
      </div>
      
      <button
        onClick={handleAddToCart}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center"
      >
        <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
        Add to Cart
      </button>
    </div>
  );
};

export default MobileAddToCartBar;
