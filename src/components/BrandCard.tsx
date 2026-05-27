import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brand } from '../types';
import { Star, ArrowRight } from 'lucide-react';

interface BrandCardProps {
  brand: Brand;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const brandSlug = (brand as any).slug;
    const finalSlug = brandSlug 
      ? brandSlug.toLowerCase() 
      : (brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || brand.id);
    navigate(`/brand/${finalSlug}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer flex flex-col h-full"
    >
      {/* Large Image - Amazon Style */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full overflow-hidden flex-shrink-0">
        <img
          src={brand.image}
          alt={brand.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Logo Overlay */}
        {brand.logo && (
          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg">
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Minimal Content - Amazon Style */}
      <div className="p-2 sm:p-3 flex flex-col flex-grow">
        {/* Brand Name */}
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 line-clamp-1">
          {brand.name}
        </h3>
        
        {/* Specialty */}
        <p className="text-xs text-gray-600 mb-2 line-clamp-1">
          {brand.specialty}
        </p>
        
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="h-3 w-3 text-yellow-400 fill-current"
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({brand.productCount})
          </span>
        </div>
        
        {/* Spacer */}
        <div className="flex-grow"></div>
        
        {/* View Button */}
        <button className="w-full bg-gradient-to-r from-eco-500 to-nature-500 text-white py-2 rounded-lg text-sm font-semibold hover:from-eco-600 hover:to-nature-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-1 group-hover:scale-105">
          <span>View Products</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default BrandCard;

// Made with Bob
