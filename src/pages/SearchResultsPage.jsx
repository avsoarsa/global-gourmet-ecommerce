import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '../components/common/ProductCard';
import { products } from '../data/products';
import SEO from '../components/common/SEO';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    // Reset to first page when query changes
    setCurrentPage(1);
    
    // Simulate search delay
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      if (query) {
        // Filter products based on search query
        const results = products.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query]);

  // Sort search results
  const sortedResults = [...searchResults].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default: // relevance - keep original order
        return 0;
    }
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedResults.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedResults.length / productsPerPage);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newQuery = formData.get('search');
    setSearchParams({ q: newQuery });
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Handle pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title={`Search Results for "${query}" | Global Gourmet`}
        description={`Search results for "${query}" - Find premium quality dry fruits, spices, nuts, and superfoods at Global Gourmet.`}
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {query ? `Search Results for "${query}"` : 'Search Our Products'}
        </h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-xl">
          <div className="relative">
            <input
              type="text"
              name="search"
              defaultValue={query}
              placeholder="Search for products..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {query && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-600 mb-4 sm:mb-0">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
              </p>
              
              {searchResults.length > 0 && (
                <div className="flex items-center">
                  <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={handleSortChange}
                    className="form-select border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              )}
            </div>
          )}
          
          {searchResults.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <nav className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 border border-gray-300 rounded-l-md ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`px-4 py-2 border-t border-b border-gray-300 ${
                          currentPage === i + 1
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 border border-gray-300 rounded-r-md ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            query && (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-5xl mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No results found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching "{query}".
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/products"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
                  >
                    Browse All Products
                  </Link>
                  <button
                    onClick={() => setSearchParams({})}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;
