import React, { useState } from 'react';
import { Star, Heart, Shield, CheckCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

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
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
    >
      
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
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
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
              {discountPercentage}% offer
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

        {/* Quick View Button - Shows on hover */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 flex items-center space-x-2 font-medium text-sm"
          >
            <Eye className="h-4 w-4" />
            <span>Quick View</span>
          </button>
        )}
        
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
      <div className="p-4">
        
        {/* Brand */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="bg-green-100 p-1 rounded">
            <Shield className="h-3 w-3 text-green-600" />
          </div>
          <span className="text-xs text-gray-600 font-medium">{product.brand}</span>
        </div>
        
        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
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
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviews})
          </span>
        </div>
        
        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.features.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-green-600">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              product.inStock
                ? 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
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