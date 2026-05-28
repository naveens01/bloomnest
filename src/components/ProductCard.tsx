import React, { useState } from 'react';
import { Star, Heart, Shield, CheckCircle, Eye, Sparkles, TrendingUp } from 'lucide-react';
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
  const [imageLoaded, setImageLoaded] = useState(false);
  
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
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    
    setShowNotification(true);
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
      className="group relative bg-gradient-to-br from-white via-white to-eco-50/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-eco-100/50 cursor-pointer flex flex-col h-full transform hover:-translate-y-2"
    >
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-eco-400 via-nature-400 to-ocean-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10"></div>
      
      {/* Image Container - Bigger image */}
      <div className="relative h-52 sm:h-64 md:h-72 lg:h-80 w-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-eco-50 to-nature-50">
        <LazyImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          placeholderClassName="rounded-t-2xl"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Top badges row - Left side only */}
        <div className="absolute top-3 left-3 flex items-center space-x-2 z-10">
          {/* ECO Badge - Modern glassmorphism */}
          <div className="bg-gradient-to-r from-eco-500 to-nature-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm flex items-center space-x-1 animate-fade-in-up">
            <Sparkles className="h-3 w-3" />
            <span>ECO</span>
          </div>
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm animate-fade-in-up animation-delay-200">
              -{discountPercentage}%
            </div>
          )}
        </div>
        
        {/* Heart Button - Moved to top-right corner, separate from badges */}
        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2.5 rounded-xl transition-all duration-300 backdrop-blur-md shadow-lg transform hover:scale-110 z-10 ${
            isInWatchlist
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
          aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Heart className={`h-4 w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button - Modern style */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className="hidden sm:flex absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 bg-white/95 backdrop-blur-md text-gray-900 px-4 py-2.5 rounded-xl shadow-xl hover:bg-white items-center space-x-2 font-semibold text-sm border border-gray-200"
          >
            <Eye className="h-4 w-4" />
            <span>Quick View</span>
          </button>
        )}
        
        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl">
              Out of Stock
            </div>
          </div>
        )}

        {/* Trending indicator */}
        {product.rating >= 4.5 && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <TrendingUp className="h-3 w-3" />
            <span>Trending</span>
          </div>
        )}
      </div>
      
      {/* Content Container - Compact with smaller text */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-grow bg-gradient-to-b from-white to-eco-50/20">
        
        {/* Brand/Category tag - Smaller */}
        <div className="mb-1.5">
          <span className="inline-block bg-eco-100 text-eco-700 px-2 py-0.5 rounded-lg text-[10px] font-semibold">
            {product.brand}
          </span>
        </div>
        
        {/* Product Name - Readable but compact */}
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5 line-clamp-2 leading-tight group-hover:text-eco-600 transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Rating - Compact */}
        <div className="flex items-center space-x-1.5 mb-2">
          <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-1.5 py-0.5 rounded-lg">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-2.5 w-2.5 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-500 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-semibold text-gray-600">
            {product.rating} <span className="text-gray-400">({product.reviews})</span>
          </span>
        </div>
        
        {/* Spacer */}
        <div className="flex-grow"></div>
        
        {/* Price - Smaller but still prominent */}
        <div className="mb-2 bg-gradient-to-r from-eco-50 to-nature-50 p-2 rounded-lg border border-eco-100">
          <div className="flex items-baseline space-x-1.5 mb-0.5">
            <span className="text-base sm:text-lg font-black text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-500 line-through font-medium">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          {discountPercentage > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-bold text-green-600">
                Save ₹{product.originalPrice! - product.price}
              </span>
              <span className="text-[9px] text-gray-500">({discountPercentage}% off)</span>
            </div>
          )}
        </div>
        
        {/* Add to Cart Button - Smaller */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-2 rounded-lg text-xs font-bold transition-all duration-300 transform ${
            product.inStock
              ? 'bg-gradient-to-r from-eco-500 via-nature-500 to-eco-600 text-white hover:from-eco-600 hover:via-nature-600 hover:to-eco-700 active:scale-95 shadow-md hover:shadow-lg hover:shadow-eco-500/50'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.inStock ? (
            <span className="flex items-center justify-center space-x-1.5">
              <Shield className="h-3 w-3" />
              <span>Add to Cart</span>
            </span>
          ) : (
            'Out of Stock'
          )}
        </button>
      </div>
      
      {/* Add to Cart Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-green-400">
            <CheckCircle className="h-5 w-5" />
            <div>
              <p className="font-bold text-sm">Added to cart!</p>
              <p className="text-xs opacity-90">{product.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;

// Made with Bob
