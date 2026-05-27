import React, { useState } from 'react';
import { Star, Heart, Shield, CheckCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import LazyImage from './LazyImage';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isInWatchlist = false,
  onToggleWatchlist,
  onQuickView
}) => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWatchlist) {
      onToggleWatchlist(product);
    }
  };

  const handleCardClick = () => {
    // Navigate to product detail page using product slug or id
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    
    // Show notification
    setShowNotification(true);
    
    // Hide notification after 2 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer flex flex-col h-full"
    >
      
      {/* Image Container - Responsive height */}
      <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 w-full overflow-hidden flex-shrink-0">
        <LazyImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          placeholderClassName="rounded-t-xl sm:rounded-t-2xl"
        />
        
        {/* ECO Badge */}
        <div className="absolute top-2 left-2">
          <div className="bg-green-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-semibold">
            ECO
          </div>
        </div>
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-bold shadow-lg">
              {discountPercentage}% OFF
            </div>
          </div>
        )}
        
        {/* Heart Button */}
        <button
          onClick={handleLike}
          className={`absolute ${discountPercentage > 0 ? 'top-8 sm:top-10' : 'top-2'} right-2 p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${
            isInWatchlist
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
          aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button - Shows on hover (hidden on mobile) */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-gray-900 px-3 py-1.5 rounded-lg shadow-lg hover:bg-gray-50 items-center space-x-1.5 font-medium text-xs"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Quick View</span>
          </button>
        )}
        
        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
              Out of Stock
            </div>
          </div>
        )}
      </div>
      
      {/* Content Container - Flex grow to fill space */}
      <div className="p-2.5 sm:p-3 md:p-4 flex flex-col flex-grow">
        
        {/* Brand */}
        <div className="flex items-center space-x-1.5 mb-1.5 sm:mb-2">
          <div className="bg-green-100 p-0.5 sm:p-1 rounded">
            <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-600" />
          </div>
          <span className="text-[10px] sm:text-xs text-gray-600 font-medium truncate">{product.brand}</span>
        </div>
        
        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[2.8rem]">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center space-x-0.5 sm:space-x-1 mb-2 sm:mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
                i < Math.floor(product.rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-[10px] sm:text-xs text-gray-500 ml-0.5 sm:ml-1">
            ({product.reviews})
          </span>
        </div>
        
        {/* Features - Hidden on smallest mobile, shown on sm+ */}
        <div className="hidden sm:flex flex-wrap gap-1 mb-2 md:mb-3">
          {product.features.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full truncate max-w-[80px]"
            >
              {feature}
            </span>
          ))}
        </div>
        
        {/* Spacer to push price/button to bottom */}
        <div className="flex-grow"></div>
        
        {/* Price and Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-auto pt-2 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1.5">
            <span className="text-base sm:text-lg font-bold text-green-600">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
              product.inStock
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 active:scale-95 shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.inStock ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
      
      {/* Add to Cart Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Added to cart!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;