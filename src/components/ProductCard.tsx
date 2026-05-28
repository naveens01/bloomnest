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
      
      {/* Image Container - Modern with overlay effects */}
      <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-eco-50 to-nature-50">
        <LazyImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          placeholderClassName="rounded-t-2xl"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
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
        
        {/* Heart Button - Modern floating style */}
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
      
      {/* Content Container - Modern spacing and typography */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow bg-gradient-to-b from-white to-eco-50/20">
        
        {/* Brand/Category tag */}
        <div className="mb-2">
          <span className="inline-block bg-eco-100 text-eco-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
            {product.brand}
          </span>
        </div>
        
        {/* Product Name - Better typography */}
        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-eco-600 transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Rating - Modern design */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-2 py-1 rounded-lg">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-500 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-600">
            {product.rating} <span className="text-gray-400">({product.reviews})</span>
          </span>
        </div>
        
        {/* Spacer */}
        <div className="flex-grow"></div>
        
        {/* Price - Bold and modern */}
        <div className="mb-3 bg-gradient-to-r from-eco-50 to-nature-50 p-3 rounded-xl border border-eco-100">
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-xl sm:text-2xl font-black text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through font-medium">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          {discountPercentage > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold text-green-600">
                Save ₹{product.originalPrice! - product.price}
              </span>
              <span className="text-xs text-gray-500">({discountPercentage}% off)</span>
            </div>
          )}
        </div>
        
        {/* Add to Cart Button - Modern gradient */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 transform ${
            product.inStock
              ? 'bg-gradient-to-r from-eco-500 via-nature-500 to-eco-600 text-white hover:from-eco-600 hover:via-nature-600 hover:to-eco-700 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-eco-500/50'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.inStock ? (
            <span className="flex items-center justify-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Add to Cart</span>
            </span>
          ) : (
            'Out of Stock'
          )}
        </button>

        {/* Free shipping indicator */}
        {product.inStock && (
          <div className="mt-2 text-center">
            <span className="text-xs text-eco-600 font-semibold">
              ✓ Free Shipping Available
            </span>
          </div>
        )}
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
