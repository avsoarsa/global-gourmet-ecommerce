import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, 
  faArrowLeft, 
  faPlus, 
  faTimes,
  faUtensils
} from '@fortawesome/free-solid-svg-icons';
import { recipes, getRecipeById } from '../../data/recipes';
import { products } from '../../data/products';

const RecipeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== undefined;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    prepTime: '',
    difficulty: 'Easy',
    servings: 4,
    image: '',
    relatedProductIds: []
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  
  useEffect(() => {
    if (isEditMode) {
      // In a real app, this would be an API call
      const recipe = getRecipeById(parseInt(id));
      if (recipe) {
        setFormData({
          ...recipe,
          // Ensure arrays are properly copied
          ingredients: [...recipe.ingredients],
          instructions: [...recipe.instructions],
          relatedProductIds: [...recipe.relatedProductIds]
        });
      }
      setIsLoading(false);
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };
  
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };
  
  const removeIngredient = (index) => {
    const newIngredients = [...formData.ingredients];
    newIngredients.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };
  
  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };
  
  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };
  
  const removeInstruction = (index) => {
    const newInstructions = [...formData.instructions];
    newInstructions.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };
  
  const handleProductToggle = (productId) => {
    const newRelatedProductIds = [...formData.relatedProductIds];
    const index = newRelatedProductIds.indexOf(productId);
    
    if (index === -1) {
      newRelatedProductIds.push(productId);
    } else {
      newRelatedProductIds.splice(index, 1);
    }
    
    setFormData(prev => ({
      ...prev,
      relatedProductIds: newRelatedProductIds
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.prepTime.trim()) {
      newErrors.prepTime = 'Prep time is required';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    }
    
    if (formData.ingredients.some(i => !i.trim())) {
      newErrors.ingredients = 'All ingredients must be filled';
    }
    
    if (formData.instructions.some(i => !i.trim())) {
      newErrors.instructions = 'All instructions must be filled';
    }
    
    if (formData.relatedProductIds.length === 0) {
      newErrors.relatedProductIds = 'At least one related product is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // In a real app, this would be an API call
    if (isEditMode) {
      // Update existing recipe
      console.log('Updating recipe:', formData);
      // API call would go here
    } else {
      // Create new recipe
      console.log('Creating new recipe:', formData);
      // API call would go here
    }
    
    // Navigate back to recipes list
    navigate('/admin/recipes');
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
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FontAwesomeIcon icon={faUtensils} className="mr-2 text-green-600" />
          {isEditMode ? 'Edit Recipe' : 'Create Recipe'}
        </h1>
        <button
          onClick={() => navigate('/admin/recipes')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Recipes
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Recipe Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>
              
              {/* Image URL */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                )}
                {formData.image && (
                  <div className="mt-2">
                    <img 
                      src={formData.image} 
                      alt="Recipe preview" 
                      className="h-32 w-auto object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              
              {/* Recipe Details */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700">
                    Prep Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="prepTime"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleChange}
                    placeholder="e.g. 30 minutes"
                    className={`mt-1 block w-full border ${errors.prepTime ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.prepTime && (
                    <p className="mt-1 text-sm text-red-500">{errors.prepTime}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="servings" className="block text-sm font-medium text-gray-700">
                    Servings
                  </label>
                  <input
                    type="number"
                    id="servings"
                    name="servings"
                    min="1"
                    value={formData.servings}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              {/* Related Products */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Products <span className="text-red-500">*</span>
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`product-${product.id}`}
                        checked={formData.relatedProductIds.includes(product.id)}
                        onChange={() => handleProductToggle(product.id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`product-${product.id}`} className="ml-2 block text-sm text-gray-900">
                        {product.name}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.relatedProductIds && (
                  <p className="mt-1 text-sm text-red-500">{errors.relatedProductIds}</p>
                )}
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Ingredients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredients <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        placeholder={`Ingredient ${index + 1}`}
                        className={`block w-full border ${errors.ingredients ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                      />
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        disabled={formData.ingredients.length <= 1}
                        className={`ml-2 p-2 rounded-md ${formData.ingredients.length <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-100'}`}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.ingredients && (
                  <p className="mt-1 text-sm text-red-500">{errors.ingredients}</p>
                )}
                <button
                  type="button"
                  onClick={addIngredient}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Add Ingredient
                </button>
              </div>
              
              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {formData.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mt-2 mr-2 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <textarea
                        value={instruction}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        placeholder={`Step ${index + 1}`}
                        rows="2"
                        className={`block w-full border ${errors.instructions ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                      />
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        disabled={formData.instructions.length <= 1}
                        className={`ml-2 p-2 rounded-md ${formData.instructions.length <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-100'}`}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.instructions && (
                  <p className="mt-1 text-sm text-red-500">{errors.instructions}</p>
                )}
                <button
                  type="button"
                  onClick={addInstruction}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Add Step
                </button>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {isEditMode ? 'Update Recipe' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeFormPage;
