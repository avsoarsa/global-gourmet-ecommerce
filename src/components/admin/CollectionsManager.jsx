import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faCheck,
  faLayerGroup,
  faImage,
  faEye,
  faStar,
  faToggleOn,
  faToggleOff
} from '@fortawesome/free-solid-svg-icons';
import { 
  getAllCollections, 
  createCollection, 
  updateCollection, 
  deleteCollection 
} from '../../data/collections';

const CollectionsManager = ({ onSelectCollection, selectedCollections = [], onCollectionsChange }) => {
  const [collections, setCollections] = useState([]);
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState(null);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    image: '',
    featured: false,
    active: true,
    productIds: []
  });
  const [error, setError] = useState(null);
  
  // Load collections
  useEffect(() => {
    const loadCollections = () => {
      const allCollections = getAllCollections();
      setCollections(allCollections);
    };
    
    loadCollections();
  }, []);
  
  // Handle new collection input change
  const handleNewCollectionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCollection(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle collection selection
  const handleCollectionSelect = (collection) => {
    if (onSelectCollection) {
      onSelectCollection(collection);
    }
  };
  
  // Handle collection toggle for multi-select
  const handleCollectionToggle = (collection) => {
    if (!onCollectionsChange) return;
    
    const isSelected = selectedCollections.some(c => c.id === collection.id);
    
    if (isSelected) {
      // Remove collection
      onCollectionsChange(selectedCollections.filter(c => c.id !== collection.id));
    } else {
      // Add collection
      onCollectionsChange([...selectedCollections, collection]);
    }
  };
  
  // Add new collection
  const handleAddCollection = () => {
    if (!newCollection.name.trim()) {
      setError('Collection name is required');
      return;
    }
    
    // Check if collection with same name already exists
    if (collections.some(collection => collection.name.toLowerCase() === newCollection.name.toLowerCase())) {
      setError('A collection with this name already exists');
      return;
    }
    
    try {
      // Generate slug from name
      const slug = newCollection.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const createdCollection = createCollection({
        ...newCollection,
        slug
      });
      
      setCollections(prev => [...prev, createdCollection]);
      setNewCollection({
        name: '',
        description: '',
        image: '',
        featured: false,
        active: true,
        productIds: []
      });
      setIsAddingCollection(false);
      setError(null);
    } catch (error) {
      console.error('Error creating collection:', error);
      setError('Failed to create collection');
    }
  };
  
  // Start editing collection
  const handleEditStart = (collection) => {
    setEditingCollectionId(collection.id);
    setNewCollection({
      name: collection.name,
      description: collection.description,
      image: collection.image,
      featured: collection.featured,
      active: collection.active
    });
  };
  
  // Cancel editing
  const handleEditCancel = () => {
    setEditingCollectionId(null);
    setNewCollection({
      name: '',
      description: '',
      image: '',
      featured: false,
      active: true,
      productIds: []
    });
  };
  
  // Save edited collection
  const handleEditSave = (collectionId) => {
    if (!newCollection.name.trim()) {
      setError('Collection name is required');
      return;
    }
    
    // Check if collection with same name already exists (excluding the current collection)
    if (collections.some(collection => collection.id !== collectionId && collection.name.toLowerCase() === newCollection.name.toLowerCase())) {
      setError('A collection with this name already exists');
      return;
    }
    
    try {
      // Generate slug from name
      const slug = newCollection.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const collection = collections.find(c => c.id === collectionId);
      const updatedCollection = updateCollection(collectionId, {
        ...newCollection,
        slug,
        productIds: collection.productIds // Preserve existing product IDs
      });
      
      setCollections(prev => prev.map(collection => collection.id === collectionId ? updatedCollection : collection));
      setEditingCollectionId(null);
      setNewCollection({
        name: '',
        description: '',
        image: '',
        featured: false,
        active: true,
        productIds: []
      });
      setError(null);
    } catch (error) {
      console.error('Error updating collection:', error);
      setError('Failed to update collection');
    }
  };
  
  // Delete collection
  const handleDeleteCollection = (collectionId) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        deleteCollection(collectionId);
        setCollections(prev => prev.filter(collection => collection.id !== collectionId));
        
        // If this collection was selected, remove it from selection
        if (selectedCollections.some(collection => collection.id === collectionId) && onCollectionsChange) {
          onCollectionsChange(selectedCollections.filter(collection => collection.id !== collectionId));
        }
      } catch (error) {
        console.error('Error deleting collection:', error);
        setError('Failed to delete collection');
      }
    }
  };
  
  // Toggle collection featured status
  const handleToggleFeatured = (collectionId) => {
    try {
      const collection = collections.find(c => c.id === collectionId);
      const updatedCollection = updateCollection(collectionId, {
        featured: !collection.featured
      });
      
      setCollections(prev => prev.map(collection => collection.id === collectionId ? updatedCollection : collection));
    } catch (error) {
      console.error('Error updating collection:', error);
      setError('Failed to update collection');
    }
  };
  
  // Toggle collection active status
  const handleToggleActive = (collectionId) => {
    try {
      const collection = collections.find(c => c.id === collectionId);
      const updatedCollection = updateCollection(collectionId, {
        active: !collection.active
      });
      
      setCollections(prev => prev.map(collection => collection.id === collectionId ? updatedCollection : collection));
    } catch (error) {
      console.error('Error updating collection:', error);
      setError('Failed to update collection');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-gray-500" />
          Collections
        </h3>
        
        {!isAddingCollection && (
          <button
            type="button"
            onClick={() => setIsAddingCollection(true)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
            Add Collection
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Add/Edit Collection Form */}
      {isAddingCollection && (
        <div className="mb-4 p-4 border border-gray-200 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Collection</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="collection-name" className="block text-sm font-medium text-gray-700 mb-1">
                Collection Name *
              </label>
              <input
                type="text"
                id="collection-name"
                name="name"
                value={newCollection.name}
                onChange={handleNewCollectionChange}
                className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g. Summer Favorites"
              />
            </div>
            
            <div>
              <label htmlFor="collection-image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                id="collection-image"
                name="image"
                value={newCollection.image}
                onChange={handleNewCollectionChange}
                className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="mt-3">
            <label htmlFor="collection-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="collection-description"
              name="description"
              value={newCollection.description}
              onChange={handleNewCollectionChange}
              rows="2"
              className="form-textarea block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Brief description of the collection"
            ></textarea>
          </div>
          
          <div className="mt-3 flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="collection-featured"
                name="featured"
                checked={newCollection.featured}
                onChange={handleNewCollectionChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="collection-featured" className="ml-2 block text-sm text-gray-700">
                Featured Collection
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="collection-active"
                name="active"
                checked={newCollection.active}
                onChange={handleNewCollectionChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="collection-active" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsAddingCollection(false);
                setError(null);
              }}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-1.5" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddCollection}
              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FontAwesomeIcon icon={faCheck} className="mr-1.5" />
              Add Collection
            </button>
          </div>
        </div>
      )}
      
      {/* Collections List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {collections.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No collections found. Click "Add Collection" to create your first collection.
          </p>
        ) : (
          collections.map(collection => (
            <div 
              key={collection.id}
              className={`flex items-start justify-between p-3 rounded-md ${
                editingCollectionId === collection.id 
                  ? 'bg-blue-50 border border-blue-200' 
                  : selectedCollections.some(c => c.id === collection.id)
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {editingCollectionId === collection.id ? (
                <div className="flex-1 pr-2">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newCollection.name}
                        onChange={handleNewCollectionChange}
                        className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                      <input
                        type="text"
                        name="image"
                        value={newCollection.image}
                        onChange={handleNewCollectionChange}
                        className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={newCollection.description}
                      onChange={handleNewCollectionChange}
                      rows="2"
                      className="form-textarea block w-full sm:text-sm border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`edit-featured-${collection.id}`}
                        name="featured"
                        checked={newCollection.featured}
                        onChange={handleNewCollectionChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`edit-featured-${collection.id}`} className="ml-2 block text-xs text-gray-700">
                        Featured
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`edit-active-${collection.id}`}
                        name="active"
                        checked={newCollection.active}
                        onChange={handleNewCollectionChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`edit-active-${collection.id}`} className="ml-2 block text-xs text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onCollectionsChange ? handleCollectionToggle(collection) : handleCollectionSelect(collection)}
                >
                  <div className="flex items-center">
                    {onCollectionsChange && (
                      <input
                        type="checkbox"
                        checked={selectedCollections.some(c => c.id === collection.id)}
                        onChange={() => handleCollectionToggle(collection)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-2"
                      />
                    )}
                    
                    {collection.image && (
                      <div className="h-10 w-10 flex-shrink-0 mr-3">
                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="h-10 w-10 rounded-md object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40?text=No+Image';
                          }}
                        />
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 flex items-center">
                        {collection.name}
                        {collection.featured && (
                          <FontAwesomeIcon icon={faStar} className="ml-1 text-yellow-500 text-xs" title="Featured" />
                        )}
                        {!collection.active && (
                          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </h4>
                      {collection.description && (
                        <p className="text-xs text-gray-500 mt-1">{collection.description}</p>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {collection.productIds.length} {collection.productIds.length === 1 ? 'product' : 'products'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-1 ml-2">
                {editingCollectionId === collection.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleEditSave(collection.id)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Save"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button
                      type="button"
                      onClick={handleEditCancel}
                      className="p-1 text-gray-600 hover:text-gray-800"
                      title="Cancel"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(collection.id)}
                      className={`p-1 ${collection.featured ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                      title={collection.featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      <FontAwesomeIcon icon={faStar} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(collection.id)}
                      className={`p-1 ${collection.active ? 'text-green-500' : 'text-gray-400'} hover:text-green-600`}
                      title={collection.active ? 'Deactivate' : 'Activate'}
                    >
                      <FontAwesomeIcon icon={collection.active ? faToggleOn : faToggleOff} />
                    </button>
                    <Link
                      to={`/admin/collections/${collection.id}`}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="View/Edit Products"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEditStart(collection)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCollection(collection.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CollectionsManager;
