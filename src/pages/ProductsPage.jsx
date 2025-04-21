import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { products, categories } from '../data/products';

const ProductsPage = () => {
  const { categorySlug } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Show 8 products per page

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
    } else {
      setSelectedCategory('All Products');
    }
  }, [categorySlug]);

  // Filter products based on selected category
  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== 'All Products') {
      result = result.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [selectedCategory]);

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {selectedCategory}
      </h1>

      {/* Category Navigation */}
      <div className="mb-8">
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

      {/* Products */}
      {currentProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
