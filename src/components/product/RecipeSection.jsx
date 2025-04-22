import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { getRecipesForProduct } from '../../data/recipes';
import RecipeCard from './RecipeCard';

const RecipeSection = ({ productId, compact = false, setActiveTab }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch recipes related to this product
    const productRecipes = getRecipesForProduct(productId);
    setRecipes(productRecipes);
  }, [productId]);

  // If no recipes, don't render anything
  if (recipes.length === 0) {
    return null;
  }

  // Render different layouts based on compact mode
  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faUtensils} className="mr-2 text-green-600" />
            Recipes with this Product
          </h3>
        </div>

        <div className="space-y-3">
          {recipes.slice(0, 4).map(recipe => (
            <div key={recipe.id} className="flex items-start space-x-3 border-b border-gray-100 pb-3">
              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800">{recipe.title}</h4>
                <p className="text-xs text-gray-500">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>

        {recipes.length > 4 && (
          <button
            onClick={() => setActiveTab('recipes')}
            className="w-full text-center py-2 text-xs text-green-600 hover:text-green-700 font-medium"
          >
            View All {recipes.length} Recipes
          </button>
        )}

        {recipes.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-3">No recipes available for this product.</p>
        )}
      </div>
    );
  }

  // Regular full-size recipe section
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <FontAwesomeIcon icon={faUtensils} className="mr-2 text-green-600" />
          Recipes with this Product
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {recipes.length === 0 && (
        <p className="text-gray-500 text-center py-8">No recipes available for this product.</p>
      )}
    </div>
  );
};

export default RecipeSection;
