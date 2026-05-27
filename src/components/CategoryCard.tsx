import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';
import { Star, ArrowRight, Leaf, TrendingUp } from 'lucide-react';

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
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-lg border border-gray-100"
    >
      {/* Premium Image Section */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay - Always visible for premium look */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* ECO Badge - Modern floating design */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-400 to-emerald-500 px-3 py-1.5 rounded-full shadow-xl transform transition-all duration-300 group-hover:scale-110">
          <div className="flex items-center space-x-1">
            <Leaf className="h-3 w-3 text-white" />
            <span className="text-xs font-bold text-white">ECO</span>
          </div>
        </div>
        
        {/* Trending Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3 text-eco-600" />
            <span className="text-xs font-bold text-gray-700">Popular</span>
          </div>
        </div>
        
        {/* Category Name Overlay - Modern typography */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 drop-shadow-lg">
            {category.name}
          </h3>
          <p className="text-sm text-white/90 font-medium">
            Sustainable & Eco-Friendly
          </p>
        </div>
      </div>
      
      {/* Modern Content Section */}
      <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
        {/* Rating and Product Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 text-amber-400 fill-amber-400"
              />
            ))}
          </div>
          <span className="text-lg font-bold text-gray-900">
            {category.count}
          </span>
        </div>
        
        {/* Product Count Label */}
        <div className="mb-4">
          <span className="text-sm text-gray-600 font-medium">
            Available Products
          </span>
        </div>
        
        {/* Modern CTA Button */}
        <button className="w-full bg-gradient-to-r from-eco-500 via-eco-600 to-nature-600 text-white py-3 rounded-xl text-sm font-bold hover:from-eco-600 hover:via-eco-700 hover:to-nature-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2">
          <span>Explore Now</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-eco-500/10 to-nature-500/10" />
    </div>
  );
};

export default CategoryCard;

// Made with Bob
