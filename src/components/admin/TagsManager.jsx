import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faCheck,
  faTags,
  faPalette
} from '@fortawesome/free-solid-svg-icons';
import { getAllTags, createTag, updateTag, deleteTag } from '../../data/tags';

const TagsManager = ({ onSelectTag, selectedTags = [], onTagsChange }) => {
  const [tags, setTags] = useState([]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [editingTagId, setEditingTagId] = useState(null);
  const [newTag, setNewTag] = useState({
    name: '',
    color: '#6BCB77',
    description: ''
  });
  const [error, setError] = useState(null);
  
  // Load tags
  useEffect(() => {
    const loadTags = () => {
      const allTags = getAllTags();
      setTags(allTags);
    };
    
    loadTags();
  }, []);
  
  // Handle new tag input change
  const handleNewTagChange = (e) => {
    const { name, value } = e.target;
    setNewTag(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle tag selection
  const handleTagSelect = (tag) => {
    if (onSelectTag) {
      onSelectTag(tag);
    }
  };
  
  // Handle tag toggle for multi-select
  const handleTagToggle = (tag) => {
    if (!onTagsChange) return;
    
    const isSelected = selectedTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      // Remove tag
      onTagsChange(selectedTags.filter(t => t.id !== tag.id));
    } else {
      // Add tag
      onTagsChange([...selectedTags, tag]);
    }
  };
  
  // Add new tag
  const handleAddTag = () => {
    if (!newTag.name.trim()) {
      setError('Tag name is required');
      return;
    }
    
    // Check if tag with same name already exists
    if (tags.some(tag => tag.name.toLowerCase() === newTag.name.toLowerCase())) {
      setError('A tag with this name already exists');
      return;
    }
    
    try {
      // Generate slug from name
      const slug = newTag.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const createdTag = createTag({
        ...newTag,
        slug
      });
      
      setTags(prev => [...prev, createdTag]);
      setNewTag({
        name: '',
        color: '#6BCB77',
        description: ''
      });
      setIsAddingTag(false);
      setError(null);
    } catch (error) {
      console.error('Error creating tag:', error);
      setError('Failed to create tag');
    }
  };
  
  // Start editing tag
  const handleEditStart = (tag) => {
    setEditingTagId(tag.id);
    setNewTag({
      name: tag.name,
      color: tag.color,
      description: tag.description
    });
  };
  
  // Cancel editing
  const handleEditCancel = () => {
    setEditingTagId(null);
    setNewTag({
      name: '',
      color: '#6BCB77',
      description: ''
    });
  };
  
  // Save edited tag
  const handleEditSave = (tagId) => {
    if (!newTag.name.trim()) {
      setError('Tag name is required');
      return;
    }
    
    // Check if tag with same name already exists (excluding the current tag)
    if (tags.some(tag => tag.id !== tagId && tag.name.toLowerCase() === newTag.name.toLowerCase())) {
      setError('A tag with this name already exists');
      return;
    }
    
    try {
      // Generate slug from name
      const slug = newTag.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const updatedTag = updateTag(tagId, {
        ...newTag,
        slug
      });
      
      setTags(prev => prev.map(tag => tag.id === tagId ? updatedTag : tag));
      setEditingTagId(null);
      setNewTag({
        name: '',
        color: '#6BCB77',
        description: ''
      });
      setError(null);
    } catch (error) {
      console.error('Error updating tag:', error);
      setError('Failed to update tag');
    }
  };
  
  // Delete tag
  const handleDeleteTag = (tagId) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        deleteTag(tagId);
        setTags(prev => prev.filter(tag => tag.id !== tagId));
        
        // If this tag was selected, remove it from selection
        if (selectedTags.some(tag => tag.id === tagId) && onTagsChange) {
          onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
        }
      } catch (error) {
        console.error('Error deleting tag:', error);
        setError('Failed to delete tag');
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FontAwesomeIcon icon={faTags} className="mr-2 text-gray-500" />
          Tags
        </h3>
        
        {!isAddingTag && (
          <button
            type="button"
            onClick={() => setIsAddingTag(true)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
            Add Tag
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
      
      {/* Add/Edit Tag Form */}
      {isAddingTag && (
        <div className="mb-4 p-4 border border-gray-200 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Tag</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="tag-name" className="block text-sm font-medium text-gray-700 mb-1">
                Tag Name *
              </label>
              <input
                type="text"
                id="tag-name"
                name="name"
                value={newTag.name}
                onChange={handleNewTagChange}
                className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g. Bestseller, New Arrival"
              />
            </div>
            
            <div>
              <label htmlFor="tag-color" className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="tag-color"
                  name="color"
                  value={newTag.color}
                  onChange={handleNewTagChange}
                  className="h-8 w-8 border-gray-300 rounded-md mr-2"
                />
                <input
                  type="text"
                  name="color"
                  value={newTag.color}
                  onChange={handleNewTagChange}
                  className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <label htmlFor="tag-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="tag-description"
              name="description"
              value={newTag.description}
              onChange={handleNewTagChange}
              className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Brief description of the tag"
            />
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsAddingTag(false);
                setError(null);
              }}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-1.5" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddTag}
              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FontAwesomeIcon icon={faCheck} className="mr-1.5" />
              Add Tag
            </button>
          </div>
        </div>
      )}
      
      {/* Tags List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {tags.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No tags found. Click "Add Tag" to create your first tag.
          </p>
        ) : (
          tags.map(tag => (
            <div 
              key={tag.id}
              className={`flex items-center justify-between p-2 rounded-md ${
                editingTagId === tag.id 
                  ? 'bg-blue-50 border border-blue-200' 
                  : selectedTags.some(t => t.id === tag.id)
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {editingTagId === tag.id ? (
                <div className="flex-1 pr-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      name="name"
                      value={newTag.name}
                      onChange={handleNewTagChange}
                      className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <div className="flex items-center">
                      <input
                        type="color"
                        name="color"
                        value={newTag.color}
                        onChange={handleNewTagChange}
                        className="h-6 w-6 border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    name="description"
                    value={newTag.description}
                    onChange={handleNewTagChange}
                    className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Description"
                  />
                </div>
              ) : (
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onTagsChange ? handleTagToggle(tag) : handleTagSelect(tag)}
                >
                  <div className="flex items-center">
                    {onTagsChange && (
                      <input
                        type="checkbox"
                        checked={selectedTags.some(t => t.id === tag.id)}
                        onChange={() => handleTagToggle(tag)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-2"
                      />
                    )}
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2"
                      style={{ 
                        backgroundColor: `${tag.color}20`, // 20% opacity
                        color: tag.color,
                        borderColor: tag.color
                      }}
                    >
                      {tag.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {tag.count} {tag.count === 1 ? 'product' : 'products'}
                    </span>
                  </div>
                  {tag.description && (
                    <p className="text-xs text-gray-500 mt-1">{tag.description}</p>
                  )}
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                {editingTagId === tag.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleEditSave(tag.id)}
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
                      onClick={() => handleEditStart(tag)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTag(tag.id)}
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

export default TagsManager;
