import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { trackPageView } from '../utils/personalizationUtils';
import ProductCard from '../components/common/ProductCard';
import MobileFilterSort from '../components/mobile/MobileFilterSort';
import { products, categories } from '../data/products';

const ProductsPage = () => {
  const { categorySlug } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  const productsPerPage = 12; // Show 12 products per page for mobile-friendly grid

  // Initialize selected category based on URL
  useEffect(() => {
    if (categorySlug) {
      // Convert slug back to category name
      const categoryName = categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace('And', '&');

      setSelectedCategory(categoryName);

      // Track category view for personalization
      trackPageView(
        `/category/${categorySlug}`,
        'category',
        { category: categoryName }
      );
    } else {
      setSelectedCategory('All Products');

      // Track all products view
      trackPageView(
        '/products',
        'category',
        { category: 'All Products' }
      );
    }
  }, [categorySlug]);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'All Products') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default: // featured
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [selectedCategory, sortBy]);

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">
        {selectedCategory}
      </h1>

      {/* Mobile Filter/Sort Component */}
      <MobileFilterSort
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSort={sortBy}
        onSortChange={handleSortChange}
      />

      {/* Desktop Category Navigation */}
      <div className="mb-8 hidden md:block">
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/products"
            className={`px-4 py-2 ${selectedCategory === 'All Products' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'} hover:bg-green-600 hover:text-white transition-colors duration-300`}
            onClick={() => setSelectedCategory('All Products')}
          >
            All Products
          </Link>

          {categories.slice(1).map(category => (
            <Link
              key={category.id}
              to={`/category/${category.name.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-')}`}
              className={`px-4 py-2 ${selectedCategory === category.name ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'} hover:bg-green-600 hover:text-white transition-colors duration-300`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Product Count and Sort (Desktop) */}
      <div className="flex justify-between items-center mb-6 hidden md:flex">
        <p className="text-gray-600">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>

        <div className="flex items-center space-x-2">
          <label htmlFor="desktop-sort" className="text-gray-700 whitespace-nowrap">Sort by:</label>
          <select
            id="desktop-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select border border-gray-300 rounded-md py-1 px-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Mobile Product Count and Sort */}
      <div className="flex justify-between items-center mb-4 md:hidden">
        <p className="text-gray-600 text-sm">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>

        <div className="inline-flex items-center">
          <label htmlFor="mobile-sort" className="text-gray-700 text-sm whitespace-nowrap mr-2">Sort by:</label>
          <div className="inline-block">
            <select
              id="mobile-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select border border-gray-300 rounded-md text-sm py-1 px-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      {currentProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 product-grid">
          {currentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found in this category.</p>
          <Link
            to="/products"
            className="mt-4 inline-block text-green-600 hover:text-green-700 font-medium"
            onClick={() => setSelectedCategory('All Products')}
          >
            View All Products
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              Prev
            </button>

            {[...Array(totalPages).keys()].map(number => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`px-3 py-1 ${currentPage === number + 1 ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                {number + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
