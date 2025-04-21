import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';

const CategoryCard = ({ category }) => {
  // Convert category name to URL-friendly format
  const categorySlug = category.name.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');

  return (
    <Link
      to={`/category/${categorySlug}`}
      className="block relative rounded-lg overflow-hidden shadow-md group"
    >
      <div className="h-40 overflow-hidden">
        <div className="w-full h-full transition-transform duration-300 group-hover:scale-110">
          <LazyImage
            src={category.image}
            alt={category.name}
            className="w-full h-full"
            type="category"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 group-hover:bg-opacity-50">
        <h3 className="text-white text-xl font-bold text-center px-4">{category.name}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
