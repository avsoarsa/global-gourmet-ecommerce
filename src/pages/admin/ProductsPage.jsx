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
  faBoxOpen,
  faFileImport,
  faFileExport,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import ExportButton from '../../components/admin/ExportButton';
import BulkActionBar from '../../components/admin/BulkActionBar';
import BulkEditModal from '../../components/admin/BulkEditModal';
import BatchImportExport from '../../components/admin/BatchImportExport';
import adminService from '../../services/adminService';
import { formatCurrency, formatNumber } from '../../utils/formatters';

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

  // State for categories and error handling
  const [categories, setCategories] = useState(['all']);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get products from API
        const { success, data, error: productsError } = await adminService.getAdminProducts({
          page,
          pageSize,
          sortBy: sortBy === 'name' ? 'name' :
                 sortBy === 'price' ? 'price' :
                 sortBy === 'stock' ? 'stock_quantity' : 'created_at',
          sortDesc: sortOrder === 'desc',
          search: searchTerm,
          category: selectedCategory === 'all' ? '' : selectedCategory
        });

        if (!success) {
          throw new Error(productsError || 'Failed to fetch products');
        }

        // Format products
        const formattedProducts = data.products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          salePrice: product.salePrice,
          stock: product.stockQuantity,
          category: product.categories && product.categories.length > 0 ?
                   product.categories[0].name : 'Uncategorized',
          image: product.primaryImage || '/images/placeholder.png',
          featured: product.isFeatured,
          active: product.isActive
        }));

        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
        setTotalPages(data.totalPages);
        setTotalProducts(data.total);

        // Extract unique categories
        const productCategories = new Set(formattedProducts.map(product => product.category));
        setCategories(['all', ...productCategories]);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message || 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [page, pageSize, sortBy, sortOrder, searchTerm, selectedCategory]);

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

  const confirmDelete = async () => {
    try {
      setIsLoading(true);

      // Delete product via API
      const { success, error: deleteError } = await adminService.deleteProduct(productToDelete.id);

      if (!success) {
        throw new Error(deleteError || 'Failed to delete product');
      }

      // Update local state
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);

      // Show success message
      // In a real app, you would use a notification system
      alert(`Product "${productToDelete.name}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(`Error deleting product: ${error.message}`);
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
      setIsLoading(false);
    }
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
  const handleBulkDelete = async (selectedIds) => {
    try {
      setIsLoading(true);

      // Delete products one by one
      const deletePromises = selectedIds.map(id => adminService.deleteProduct(id));
      const results = await Promise.allSettled(deletePromises);

      // Check for failures
      const failures = results.filter(result => result.status === 'rejected' || !result.value.success);

      if (failures.length > 0) {
        console.error('Some products could not be deleted:', failures);
        alert(`${failures.length} products could not be deleted. See console for details.`);
      }

      // Update local state
      const updatedProducts = products.filter(product => !selectedIds.includes(product.id));
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);

      // Show success message
      alert(`${selectedIds.length - failures.length} products deleted successfully`);
    } catch (error) {
      console.error('Error in bulk delete:', error);
      alert(`Error deleting products: ${error.message}`);
    } finally {
      clearSelection();
      setIsLoading(false);
    }
  };

  // Handle bulk edit
  const handleBulkEdit = () => {
    setShowBulkEditModal(true);
  };

  // Save bulk edit changes
  const saveBulkEdit = async (selectedIds, updateData) => {
    try {
      setIsLoading(true);

      // Update products one by one
      const updatePromises = selectedIds.map(async (id) => {
        // First get the current product data
        const { success: getSuccess, data: productData, error: getError } =
          await adminService.getAdminProduct(id);

        if (!getSuccess) {
          throw new Error(getError || `Failed to get product ${id}`);
        }

        // Prepare update data
        const productUpdateData = { ...productData };

        // Apply updates
        if (updateData.category) {
          // Find category ID for the category name
          // This is a simplification - in a real app, you would have a proper category mapping
          productUpdateData.categories = [updateData.category];
        }

        if (updateData.price !== undefined) {
          productUpdateData.price = updateData.price;
        }

        if (updateData.stock !== undefined) {
          productUpdateData.stockQuantity = updateData.stock;
        }

        if (updateData.featured !== undefined) {
          productUpdateData.isFeatured = updateData.featured;
        }

        // Update the product
        return adminService.updateProduct(id, productUpdateData);
      });

      const results = await Promise.allSettled(updatePromises);

      // Check for failures
      const failures = results.filter(result => result.status === 'rejected' || !result.value.success);

      if (failures.length > 0) {
        console.error('Some products could not be updated:', failures);
        alert(`${failures.length} products could not be updated. See console for details.`);
      }

      // Refresh product list
      const { success, data } = await adminService.getAdminProducts({
        page,
        pageSize,
        sortBy: sortBy === 'name' ? 'name' :
               sortBy === 'price' ? 'price' :
               sortBy === 'stock' ? 'stock_quantity' : 'created_at',
        sortDesc: sortOrder === 'desc',
        search: searchTerm,
        category: selectedCategory === 'all' ? '' : selectedCategory
      });

      if (success) {
        // Format products
        const formattedProducts = data.products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          salePrice: product.salePrice,
          stock: product.stockQuantity,
          category: product.categories && product.categories.length > 0 ?
                   product.categories[0].name : 'Uncategorized',
          image: product.primaryImage || '/images/placeholder.png',
          featured: product.isFeatured,
          active: product.isActive
        }));

        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      }

      // Show success message
      alert(`${selectedIds.length - failures.length} products updated successfully`);
    } catch (error) {
      console.error('Error in bulk edit:', error);
      alert(`Error updating products: ${error.message}`);
    } finally {
      setShowBulkEditModal(false);
      clearSelection();
      setIsLoading(false);
    }
  };

  // Handle batch import
  const handleBatchImport = (importedProducts) => {
    // In a real app, this would be an API call
    // For now, we'll just add the imported products to our existing products
    // with new IDs to avoid conflicts
    const maxId = Math.max(...products.map(p => p.id), 0);

    const newProducts = importedProducts.map((product, index) => ({
      ...product,
      id: maxId + index + 1
    }));

    setProducts([...products, ...newProducts]);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-green-500 text-4xl mb-4" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md max-w-lg">
          <h3 className="text-lg font-medium mb-2">Error Loading Products</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
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
          <BatchImportExport
            onImport={handleBatchImport}
            data={filteredProducts}
            headers={[
              { label: 'ID', key: 'id' },
              { label: 'Name', key: 'name' },
              { label: 'Category', key: 'category' },
              { label: 'Price', key: 'price', format: 'currency' },
              { label: 'Stock', key: 'stock', format: 'number' },
              { label: 'Description', key: 'description' }
            ]}
            validationSchema={{
              required: ['name', 'category', 'price'],
              numeric: ['price', 'stock', 'originalPrice', 'discount'],
              min: { price: 0, stock: 0, discount: 0 },
              max: { discount: 100 }
            }}
            templateData={[
              { id: '', name: 'Example Product', category: 'Dry Fruits', price: 19.99, stock: 100, description: 'Product description' }
            ]}
            entityName="products"
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
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatNumber(product.stock || 0)}
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{totalProducts}</span> products
          </div>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 border rounded-md text-sm font-medium ${
                page > 1
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page <= 1}
            >
              Previous
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                // If 5 or fewer pages, show all
                pageNum = i + 1;
              } else if (page <= 3) {
                // If near start, show first 5
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                // If near end, show last 5
                pageNum = totalPages - 4 + i;
              } else {
                // Otherwise show current page and 2 on each side
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    pageNum === page
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className={`px-3 py-1 border rounded-md text-sm font-medium ${
                page < totalPages
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
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
