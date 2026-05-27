import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';
import { Star, ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer flex flex-col h-full"
    >
      {/* Large Image - Amazon Style */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full overflow-hidden flex-shrink-0">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* ECO Badge */}
        <div className="absolute top-2 left-2">
          <div className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-lg">
            ECO
          </div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Minimal Content - Amazon Style */}
      <div className="p-2 sm:p-3 flex flex-col flex-grow">
        {/* Category Name */}
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 line-clamp-1">
          {category.name}
        </h3>
        
        {/* Product Count with Rating Stars */}
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="h-3 w-3 text-yellow-400 fill-current"
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({category.count})
          </span>
        </div>
        
        {/* Spacer */}
        <div className="flex-grow"></div>
        
        {/* Product Count Display */}
        <div className="mb-2">
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            {category.count} Products
          </span>
        </div>
        
        {/* Explore Button */}
        <button className="w-full bg-gradient-to-r from-eco-500 to-nature-500 text-white py-2 rounded-lg text-sm font-semibold hover:from-eco-600 hover:to-nature-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-1 group-hover:scale-105">
          <span>Explore</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;

// Made with Bob
