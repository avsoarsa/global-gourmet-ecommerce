import { Link } from 'react-router-dom';
import { products } from '../../data/products';

const ProductBreadcrumb = ({ productId }) => {
  // Find the product by ID
  const product = products.find(p => p.id === parseInt(productId));
  
  if (!product) {
    return null;
  }

  // Create a slug from the category name
  const categorySlug = product.category.toLowerCase().replace(/ /g, '-');
  
  return (
    <div className="bg-gray-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-2">
        <nav className="text-sm">
          <ol className="flex items-center flex-wrap">
            <li>
              <Link to="/" className="text-gray-500 hover:text-green-600">Home</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/products" className="text-gray-500 hover:text-green-600">Products</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to={`/category/${categorySlug}`} className="text-gray-500 hover:text-green-600">
                {product.category}
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default ProductBreadcrumb;
