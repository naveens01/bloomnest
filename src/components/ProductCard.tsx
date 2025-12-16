import React from 'react';
import { Star, Heart, Shield } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isInWatchlist = false, onToggleWatchlist }) => {
  
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWatchlist) {
      onToggleWatchlist(product);
    }
  };

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      
      {/* Image Container */}
      <div className="relative h-48 sm:h-64 w-full overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* ECO Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
            ECO
          </div>
        </div>
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3">
            <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
              -{discountPercentage}%
            </div>
          </div>
        )}
        
        {/* Heart Button */}
        <button 
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-300 ${
            isInWatchlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
          } ${discountPercentage > 0 ? 'top-12' : ''}`}
          aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Heart className={`h-4 w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
        </button>
        
        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              Out of Stock
            </div>
          </div>
        )}
      </div>
      
      {/* Content Container */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        
        {/* Brand */}
        <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
          <div className="bg-green-100 p-0.5 sm:p-1 rounded flex-shrink-0">
            <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-600" />
          </div>
          <span className="text-[10px] sm:text-xs text-gray-600 font-medium truncate min-w-0">{product.brand}</span>
        </div>
        
        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[3rem] flex items-start">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center space-x-0.5 sm:space-x-1 mb-2 sm:mb-3 flex-shrink-0">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 ${
                i < Math.floor(product.rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-[10px] sm:text-xs text-gray-500 ml-0.5 sm:ml-1 whitespace-nowrap">
            ({product.reviews})
          </span>
        </div>
        
        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3 flex-shrink-0">
          {product.features.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap"
            >
              {feature}
            </span>
          ))}
        </div>
        
        {/* Price and Action - Push to bottom */}
        <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-2">
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <span className="text-base sm:text-lg font-bold text-green-600 whitespace-nowrap">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through whitespace-nowrap">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className={`w-full sm:w-auto px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              product.inStock
                ? 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.inStock ? 'Add' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;