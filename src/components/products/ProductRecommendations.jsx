import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '../common/ProductCard';

const ProductRecommendations = ({ currentProductId, category, products, title = "You Might Also Like" }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 2;
  
  useEffect(() => {
    // Simple recommendation algorithm:
    // 1. First, get products from the same category
    // 2. Then, add other popular products if needed
    // 3. Exclude the current product
    // 4. Limit to 8 products
    
    if (!products || products.length === 0) return;
    
    let recommended = [];
    
    // Get products from the same category
    const sameCategory = products.filter(p => 
      p.id !== currentProductId && p.category === category
    );
    recommended = [...sameCategory];
    
    // If we don't have enough products, add some popular ones
    if (recommended.length < 8) {
      const otherProducts = products.filter(p => 
        p.id !== currentProductId && 
        !recommended.some(r => r.id === p.id) &&
        (p.featured || p.rating >= 4)
      );
      
      recommended = [...recommended, ...otherProducts];
    }
    
    // If we still don't have enough, add random products
    if (recommended.length < 8) {
      const remainingProducts = products.filter(p => 
        p.id !== currentProductId && 
        !recommended.some(r => r.id === p.id)
      );
      
      recommended = [...recommended, ...remainingProducts];
    }
    
    // Limit to 8 products
    setRecommendations(recommended.slice(0, 8));
  }, [currentProductId, category, products]);
  
  const handleNext = () => {
    if (currentIndex + itemsPerPage < recommendations.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  if (recommendations.length === 0) return null;
  
  return (
    <div className="mt-16 mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full ${
              currentIndex === 0 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label="Previous products"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex + itemsPerPage >= recommendations.length}
            className={`p-2 rounded-full ${
              currentIndex + itemsPerPage >= recommendations.length 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label="Next products"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {recommendations.slice(currentIndex, currentIndex + itemsPerPage).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Link 
          to={`/category/${category.toLowerCase()}`}
          className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
        >
          View All {category} Products
          <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default ProductRecommendations;
