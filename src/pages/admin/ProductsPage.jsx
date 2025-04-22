import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faFilter,
  faSortAmountDown,
  faEye,
  faCheck,
  faTimes,
  faTag,
  faBoxOpen
} from '@fortawesome/free-solid-svg-icons';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { products as productsData } from '../../data/products';
import ExportButton from '../../components/admin/ExportButton';
import BulkActionBar from '../../components/admin/BulkActionBar';
import BulkEditModal from '../../components/admin/BulkEditModal';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Bulk operations state
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);

  // Get unique categories
  const categories = ['all', ...new Set(productsData.map(product => product.category))];

  // Fetch products (simulated)
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setProducts(productsData);
      setFilteredProducts(productsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Sort products
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  // Handle delete product
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real app, this would be an API call
    const updatedProducts = products.filter(p => p.id !== productToDelete.id);
    setProducts(updatedProducts);
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Handle select all products
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      // Select all filtered products
      setSelectedProducts(filteredProducts.map(product => product.id));
    } else {
      // Deselect all products
      setSelectedProducts([]);
    }
  };

  // Handle select single product
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        // Deselect product
        return prev.filter(id => id !== productId);
      } else {
        // Select product
        return [...prev, productId];
      }
    });
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedProducts([]);
    setSelectAll(false);
  };

  // Handle bulk delete
  const handleBulkDelete = (selectedIds) => {
    // In a real app, this would be an API call
    const updatedProducts = products.filter(product => !selectedIds.includes(product.id));
    setProducts(updatedProducts);
    clearSelection();
  };

  // Handle bulk edit
  const handleBulkEdit = () => {
    setShowBulkEditModal(true);
  };

  // Save bulk edit changes
  const saveBulkEdit = (selectedIds, updateData) => {
    // In a real app, this would be an API call
    const updatedProducts = products.map(product => {
      if (selectedIds.includes(product.id)) {
        return { ...product, ...updateData };
      }
      return product;
    });

    setProducts(updatedProducts);
    setShowBulkEditModal(false);
    clearSelection();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalog
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <ExportButton
            data={filteredProducts}
            headers={[
              { label: 'ID', key: 'id' },
              { label: 'Name', key: 'name' },
              { label: 'Category', key: 'category' },
              { label: 'Price', key: 'price', format: 'currency' },
              { label: 'Stock', key: 'stock', format: 'number' },
              { label: 'Description', key: 'description' }
            ]}
            filename="products-export"
          />
          <Link
            to="/admin/products/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSortAmountDown} className="text-gray-400" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                onClick={toggleSortOrder}
                className="text-gray-400 hover:text-gray-500"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedItems={selectedProducts}
        onClearSelection={clearSelection}
        onDelete={handleBulkDelete}
        onEdit={handleBulkEdit}
        itemName="product"
        customActions={[
          {
            label: 'Mark as Featured',
            icon: faTag,
            iconClass: 'text-purple-600',
            handler: (selectedIds) => {
              const updatedProducts = products.map(product => {
                if (selectedIds.includes(product.id)) {
                  return { ...product, featured: true };
                }
                return product;
              });
              setProducts(updatedProducts);
              clearSelection();
            }
          },
          {
            label: 'Update Stock',
            icon: faBoxOpen,
            iconClass: 'text-blue-600',
            handler: () => setShowBulkEditModal(true)
          }
        ]}
      />

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      (product.stock > 0) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {(product.stock > 0) ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/product/${product.id}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No products found matching your criteria.
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        icon={faTrash}
      />

      {/* Bulk Edit Modal */}
      <BulkEditModal
        isOpen={showBulkEditModal}
        onClose={() => setShowBulkEditModal(false)}
        onSave={saveBulkEdit}
        selectedItems={selectedProducts}
        itemName="product"
        fields={[
          {
            name: 'category',
            label: 'Category',
            type: 'select',
            options: categories
              .filter(cat => cat !== 'all')
              .map(cat => ({ value: cat, label: cat }))
          },
          {
            name: 'price',
            label: 'Price',
            type: 'number',
            min: 0,
            step: 0.01,
            placeholder: 'Enter price'
          },
          {
            name: 'originalPrice',
            label: 'Original Price (MRP)',
            type: 'number',
            min: 0,
            step: 0.01,
            placeholder: 'Enter original price'
          },
          {
            name: 'discount',
            label: 'Discount Percentage',
            type: 'number',
            min: 0,
            max: 99,
            step: 1,
            placeholder: 'Enter discount percentage'
          },
          {
            name: 'stock',
            label: 'Stock',
            type: 'number',
            min: 0,
            step: 1,
            placeholder: 'Enter stock quantity'
          },
          {
            name: 'featured',
            label: 'Featured Product',
            type: 'checkbox'
          },
          {
            name: 'organic',
            label: 'Organic Product',
            type: 'checkbox'
          }
        ]}
      />
    </div>
  );
};

export default ProductsPage;
