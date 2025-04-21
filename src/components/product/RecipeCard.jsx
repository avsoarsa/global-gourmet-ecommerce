import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUsers, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Recipe Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
          {recipe.difficulty}
        </div>
      </div>
      
      {/* Recipe Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{recipe.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
        
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClock} className="mr-1 text-green-600" />
            {recipe.prepTime}
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUsers} className="mr-1 text-green-600" />
            Serves {recipe.servings}
          </div>
        </div>
        
        <Link 
          to={`/recipes/${recipe.id}`}
          className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
        >
          View Recipe
          <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
