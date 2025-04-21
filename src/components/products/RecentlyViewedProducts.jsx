import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { useRegion } from '../../context/RegionContext';
import LazyImage from '../common/LazyImage';

const RecentlyViewedProducts = ({ currentProductId }) => {
  const { getRecentlyViewedExcept } = useRecentlyViewed();
  const { currency, exchangeRate } = useRegion();
  
  // Get recently viewed products excluding the current one
  const recentProducts = getRecentlyViewedExcept(currentProductId);
  
  // Don't render if there are no recent products
  if (recentProducts.length === 0) return null;
  
  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4">Recently Viewed</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recentProducts.slice(0, 5).map(product => (
          <Link 
            key={product.id} 
            to={`/product/${product.id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 group-hover:shadow-md group-hover:-translate-y-1">
              <div className="aspect-square overflow-hidden">
                <LazyImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-700 mt-1">
                  {formatCurrency(product.price * exchangeRate, currency)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedProducts;
