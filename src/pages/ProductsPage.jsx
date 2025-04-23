import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { trackPageView } from '../utils/personalizationUtils';
import ProductCard from '../components/common/ProductCard';
import MobileFilterSort from '../components/mobile/MobileFilterSort';

const ProductsPage = () => {
  const { categorySlug } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const productsPerPage = 12; // Show 12 products per page for mobile-friendly grid

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();

        if (data.success) {
          // Add "All Products" category
          const allCategories = [
            { id: 'all', name: 'All Products', slug: 'all-products' },
            ...data.data.map(category => ({
              id: category.id,
              name: category.name,
              slug: category.slug
            }))
          ];

          setCategories(allCategories);
        } else {
          console.error('Error fetching categories:', data.error);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Initialize selected category based on URL
  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      // Find category by slug
      const category = categories.find(cat => cat.slug === categorySlug);

      if (category) {
        setSelectedCategory(category.name);

        // Track category view for personalization
        trackPageView(
          `/category/${categorySlug}`,
          'category',
          { category: category.name }
        );
      } else {
        setSelectedCategory('All Products');
      }
    } else {
      setSelectedCategory('All Products');

      // Track all products view
      trackPageView(
        '/products',
        'category',
        { category: 'All Products' }
      );
    }
  }, [categorySlug, categories]);

  // Fetch products based on category and sort
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', currentPage);
        params.append('limit', productsPerPage);

        // Add category filter if not "All Products"
        if (selectedCategory !== 'All Products' && categories.length > 0) {
          const category = categories.find(cat => cat.name === selectedCategory);
          if (category && category.slug !== 'all-products') {
            params.append('category', category.slug);
          }
        }

        // Add sort parameter
        switch (sortBy) {
          case 'price-low':
            params.append('sort', 'price');
            params.append('order', 'asc');
            break;
          case 'price-high':
            params.append('sort', 'price');
            params.append('order', 'desc');
            break;
          case 'newest':
            params.append('sort', 'created_at');
            params.append('order', 'desc');
            break;
          case 'rating':
            params.append('sort', 'rating');
            params.append('order', 'desc');
            break;
          default: // featured
            params.append('featured', 'true');
            break;
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setFilteredProducts(data.data);
          setTotalCount(data.meta.pagination.total);
        } else {
          console.error('Error fetching products:', data.error);
          setFilteredProducts([]);
          setTotalCount(0);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setFilteredProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchProducts();
    }
  }, [selectedCategory, sortBy, currentPage, categories, productsPerPage]);

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / productsPerPage);

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
          Showing {filteredProducts.length} of {totalCount} {totalCount === 1 ? 'product' : 'products'}
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
          Showing {filteredProducts.length} of {totalCount} {totalCount === 1 ? 'product' : 'products'}
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
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 product-grid">
          {[...Array(productsPerPage)].map((_, index) => (
            <div key={index} className="bg-gray-100 animate-pulse rounded-lg p-4 h-64"></div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 product-grid">
          {filteredProducts.map(product => {
            // Transform API product format to match the expected format for ProductCard
            const transformedProduct = {
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              compareAtPrice: product.compare_at_price,
              image: product.product_images?.find(img => img.is_primary)?.image_url || '/images/placeholder.jpg',
              category: product.product_categories?.name || '',
              rating: product.rating || 4.5,
              isBestseller: product.is_bestseller,
              isOrganic: product.is_organic,
              description: product.short_description
            };

            return <ProductCard key={product.id} product={transformedProduct} />;
          })}
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
