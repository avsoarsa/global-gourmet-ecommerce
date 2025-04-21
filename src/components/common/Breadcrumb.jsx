import { Link, useLocation } from 'react-router-dom';
import { products } from '../../data/products';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Skip rendering breadcrumb on homepage
  if (pathnames.length === 0) {
    return null;
  }

  // Special handling for product detail pages
  let customBreadcrumbs = null;
  if (pathnames.length >= 2 && pathnames[0] === 'product' && !isNaN(pathnames[1])) {
    const productId = parseInt(pathnames[1]);
    const product = products.find(p => p.id === productId);

    if (product) {
      // Create a custom breadcrumb for product detail pages
      const categorySlug = product.category.toLowerCase().replace(/ /g, '-');

      customBreadcrumbs = (
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
      );
    }
  }

  return (
    <div className="bg-gray-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-2">
        <nav className="text-sm">
          {customBreadcrumbs || (
            <ol className="flex items-center flex-wrap">
              <li>
                <Link to="/" className="text-gray-500 hover:text-green-600">Home</Link>
              </li>

              {pathnames.map((name, index) => {
                // Build the path up to this point
                let routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                // Format the display name
                let displayName = name;

                // Handle special cases
                if (name === 'products') displayName = 'Products';
                if (name === 'product') displayName = 'Product';
                if (name === 'category') displayName = 'Category';
                if (name === 'gift-boxes') displayName = 'Gift Boxes';
                if (name === 'bulk-orders') displayName = 'Bulk Orders';
                if (name === 'about') displayName = 'About Us';
                if (name === 'cart') displayName = 'Cart';
                if (name === 'wishlist') displayName = 'Wishlist';

                // For product IDs, get the actual product name
                if (!isNaN(name) && pathnames[index - 1] === 'product') {
                  const productId = parseInt(name);
                  const product = products.find(p => p.id === productId);
                  if (product) {
                    displayName = product.name;
                  } else {
                    displayName = 'Product Details';
                  }
                }

                // For category slugs, format them nicely
                if (pathnames[index - 1] === 'category') {
                  displayName = name
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                }

                return (
                  <li key={routeTo} className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    {isLast ? (
                      <span className="text-gray-700 font-medium">{displayName}</span>
                    ) : (
                      <Link to={routeTo} className="text-gray-500 hover:text-green-600">
                        {displayName}
                      </Link>
                    )}
                  </li>
                );
            })}
          </ol>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
