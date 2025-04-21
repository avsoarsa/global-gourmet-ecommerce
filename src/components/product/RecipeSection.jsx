import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { getRecipesForProduct } from '../../data/recipes';
import RecipeCard from './RecipeCard';

const RecipeSection = ({ productId }) => {
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
