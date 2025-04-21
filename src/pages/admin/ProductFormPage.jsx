import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faArrowLeft,
  faExclamationTriangle,
  faImage,
  faPlus,
  faTimes,
  faCubes,
  faTags,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import { products as productsData } from '../../data/products';
import ProductVariantForm from '../../components/admin/products/ProductVariantForm';
import ProductAttributeForm from '../../components/admin/products/ProductAttributeForm';
import TagsManager from '../../components/admin/TagsManager';
import CollectionsManager from '../../components/admin/CollectionsManager';
import { getProductTags } from '../../data/tags';
import { getProductCollections } from '../../data/collections';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== undefined;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    image: '',
    featured: false,
    organic: false,
    discount: 0,
    hasVariants: false
  });

  // Variants and attributes state
  const [attributes, setAttributes] = useState([]);
  const [variants, setVariants] = useState([]);

  // Tags and collections state
  const [productTags, setProductTags] = useState([]);
  const [productCollections, setProductCollections] = useState([]);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState('basic');

  // Categories (in a real app, these would come from an API)
  const categories = [
    'Nuts',
    'Dried Fruits',
    'Spices',
    'Seeds',
    'Superfoods',
    'Gift Boxes'
  ];

  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // In a real app, this would be an API call
      const product = productsData.find(p => p.id === parseInt(id));

      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          originalPrice: product.originalPrice || '',
          category: product.category || '',
          stock: product.stock || '',
          image: product.image || '',
          featured: product.featured || false,
          organic: product.organic || false,
          discount: product.discount || 0,
          hasVariants: product.variants?.length > 0 || false
        });

        // Load variants if any
        if (product.variants && product.variants.length > 0) {
          setVariants(product.variants);
        }

        // Load attributes if any
        if (product.attributes && product.attributes.length > 0) {
          setAttributes(product.attributes);
        }

        // Load tags if any
        const tags = getProductTags(parseInt(id));
        if (tags && tags.length > 0) {
          setProductTags(tags);
        }

        // Load collections if any
        const collections = getProductCollections(parseInt(id));
        if (collections && collections.length > 0) {
          setProductCollections(collections);
        }

        setIsLoading(false);
      } else {
        // Product not found
        navigate('/admin/products', { replace: true });
      }
    }
  }, [id, isEditMode, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (formData.originalPrice && (isNaN(formData.originalPrice) || parseFloat(formData.originalPrice) <= 0)) {
      newErrors.originalPrice = 'Original price must be a positive number';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.stock) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Product image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle variants change
  const handleVariantsChange = (updatedVariants) => {
    setVariants(updatedVariants);
  };

  // Add variant
  const handleAddVariant = (newVariant) => {
    setVariants([...variants, newVariant]);
  };

  // Remove variant
  const handleRemoveVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };

  // Handle attributes change
  const handleAttributesChange = (updatedAttributes) => {
    setAttributes(updatedAttributes);
  };

  // Add attribute
  const handleAddAttribute = (newAttribute) => {
    setAttributes([...attributes, newAttribute]);
  };

  // Remove attribute
  const handleRemoveAttribute = (index) => {
    const updatedAttributes = [...attributes];
    updatedAttributes.splice(index, 1);
    setAttributes(updatedAttributes);
  };

  // Toggle variants mode
  const toggleVariantsMode = () => {
    setFormData(prev => ({
      ...prev,
      hasVariants: !prev.hasVariants
    }));

    // If turning off variants, clear variants
    if (formData.hasVariants) {
      setVariants([]);
    }
  };

  // Handle tags change
  const handleTagsChange = (tags) => {
    setProductTags(tags);
  };

  // Handle collections change
  const handleCollectionsChange = (collections) => {
    setProductCollections(collections);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare product data
      const productData = {
        ...formData,
        attributes: attributes.length > 0 ? attributes : undefined,
        variants: formData.hasVariants && variants.length > 0 ? variants : undefined,
        tags: productTags.length > 0 ? productTags : undefined,
        collections: productCollections.length > 0 ? productCollections : undefined
      };

      // In a real app, this would be an API call to create/update the product
      console.log('Submitting product data:', productData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to products page
      navigate('/admin/products', {
        state: {
          message: `Product ${isEditMode ? 'updated' : 'created'} successfully`,
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error submitting product:', error);
      setErrors({ submit: 'Failed to submit product. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/admin/products"
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`${activeTab === 'basic'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Basic Information
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('attributes')}
                className={`${activeTab === 'attributes'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <FontAwesomeIcon icon={faCubes} className="mr-2" />
                Attributes & Variants
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('organization')}
                className={`${activeTab === 'organization'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <FontAwesomeIcon icon={faTags} className="mr-2" />
                Tags & Collections
              </button>
            </nav>
          </div>

          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="p-6 space-y-6">
              {/* General Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">General Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`form-input block w-full ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`form-select block w-full ${errors.category ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className={`form-textarea block w-full ${errors.description ? 'border-red-500' : ''}`}
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>

              {/* Pricing and Inventory */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing and Inventory</h2>

                {/* Variants Toggle */}
                <div className="mb-4 p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Product Variants</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Enable this option if your product comes in multiple variants (e.g., different sizes, colors).
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={toggleVariantsMode}
                        className={`${formData.hasVariants ? 'bg-green-600' : 'bg-gray-200'}
                          relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer
                          transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                      >
                        <span className="sr-only">Use variants</span>
                        <span
                          className={`${formData.hasVariants ? 'translate-x-5' : 'translate-x-0'}
                            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform
                            ring-0 transition ease-in-out duration-200`}
                        ></span>
                      </button>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {formData.hasVariants ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {!formData.hasVariants && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className={`form-input block w-full ${errors.price ? 'border-red-500' : ''}`}
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Original Price ($)
                      </label>
                      <input
                        type="number"
                        id="originalPrice"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className={`form-input block w-full ${errors.originalPrice ? 'border-red-500' : ''}`}
                      />
                      {errors.originalPrice && (
                        <p className="mt-1 text-sm text-red-600">{errors.originalPrice}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        className={`form-input block w-full ${errors.stock ? 'border-red-500' : ''}`}
                      />
                      {errors.stock && (
                        <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      id="discount"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="form-input block w-full"
                    />
                  </div>

                  <div className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="form-checkbox h-4 w-4 text-green-600"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Featured Product
                    </label>
                  </div>

                  <div className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      id="organic"
                      name="organic"
                      checked={formData.organic}
                      onChange={handleChange}
                      className="form-checkbox h-4 w-4 text-green-600"
                    />
                    <label htmlFor="organic" className="ml-2 block text-sm text-gray-900">
                      Organic Product
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Image */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Product Image</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL *
                    </label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className={`form-input block w-full ${errors.image ? 'border-red-500' : ''}`}
                    />
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Enter a URL for the product image. In a real app, you would upload an image.
                    </p>
                  </div>

                  <div>
                    {formData.image ? (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Image Preview</p>
                        <div className="border border-gray-200 rounded-md overflow-hidden h-40 bg-gray-50">
                          <img
                            src={formData.image}
                            alt="Product preview"
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Image Preview</p>
                        <div className="border border-gray-200 rounded-md overflow-hidden h-40 bg-gray-50 flex items-center justify-center">
                          <FontAwesomeIcon icon={faImage} className="text-gray-400 text-4xl" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Error */}
              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Attributes & Variants Tab */}
          {activeTab === 'attributes' && (
            <div className="p-6 space-y-6">
              {/* Product Attributes */}
              <ProductAttributeForm
                attributes={attributes}
                onChange={handleAttributesChange}
                onAddAttribute={handleAddAttribute}
                onRemoveAttribute={handleRemoveAttribute}
              />

              {/* Product Variants */}
              {formData.hasVariants && (
                <div className="mt-8">
                  <ProductVariantForm
                    variants={variants}
                    attributes={attributes}
                    onChange={handleVariantsChange}
                    onAddVariant={handleAddVariant}
                    onRemoveVariant={handleRemoveVariant}
                  />
                </div>
              )}

              {!formData.hasVariants && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Product variants are disabled. Go to the Basic Information tab and enable variants to add product variants.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tags & Collections Tab */}
          {activeTab === 'organization' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Tags */}
                <div>
                  <TagsManager
                    selectedTags={productTags}
                    onTagsChange={handleTagsChange}
                  />
                </div>

                {/* Product Collections */}
                <div>
                  <CollectionsManager
                    selectedCollections={productCollections}
                    onCollectionsChange={handleCollectionsChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 text-right">
            <Link
              to="/admin/products"
              className="btn-outline mr-4"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormPage;
