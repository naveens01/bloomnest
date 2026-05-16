import React from 'react';
import { X, Star, Heart, ShoppingCart, Shield, Package, Truck, CheckCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (product: Product) => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isInWatchlist = false,
  onToggleWatchlist,
}) => {
  if (!isOpen) return null;

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleToggleWatchlist = () => {
    if (onToggleWatchlist) {
      onToggleWatchlist(product);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Quick View</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Image */}
            <div className="relative">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4">
                  <div className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
                    ECO
                  </div>
                </div>
                
                {discountPercentage > 0 && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                      {discountPercentage}% OFF
                    </div>
                  </div>
                )}

                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-gray-800 text-white px-6 py-3 rounded-lg text-base font-semibold">
                      Out of Stock
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600 mb-1" />
                  <span className="text-xs text-gray-600 text-center">Eco Certified</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600 mb-1" />
                  <span className="text-xs text-gray-600 text-center">Secure Pack</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
                  <Truck className="h-5 w-5 text-purple-600 mb-1" />
                  <span className="text-xs text-gray-600 text-center">Fast Ship</span>
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="flex flex-col">
              {/* Brand */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="bg-green-100 p-1.5 rounded">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-600 font-medium">{product.brand}</span>
              </div>

              {/* Product Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg text-sm font-semibold">
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Features</h4>
                <div className="space-y-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">In Stock - Ready to Ship</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600">
                    <X className="h-5 w-5" />
                    <span className="text-sm font-medium">Currently Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    product.inStock
                      ? 'bg-green-500 text-white hover:bg-green-600 active:scale-95 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>

                <button
                  onClick={handleToggleWatchlist}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isInWatchlist
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                  }`}
                  aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  <Heart className={`h-5 w-5 ${isInWatchlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;

// Made with Bob
