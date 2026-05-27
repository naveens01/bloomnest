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
      
      {/* Image Container - Large and Attractive (Amazon-style) */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full overflow-hidden flex-shrink-0">
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
      
      {/* Content Container - Minimal Amazon-style */}
      <div className="p-2 sm:p-3 flex flex-col flex-grow">
        
        {/* Product Name - 2 lines max */}
        <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1.5 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        
        {/* Rating - Compact */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviews})
          </span>
        </div>
        
        {/* Spacer */}
        <div className="flex-grow"></div>
        
        {/* Price - Bold and prominent */}
        <div className="mb-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-lg sm:text-xl font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          {discountPercentage > 0 && (
            <span className="text-xs text-green-600 font-medium">
              Save {discountPercentage}%
            </span>
          )}
        </div>
        
        {/* Add to Cart Button - Full width, prominent */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            product.inStock
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 active:scale-95 shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
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