import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowLeft, Sparkles, Trash2, Star, Leaf } from 'lucide-react';

interface WatchlistPageProps {
  items: Product[];
  onToggleWatchlist: (product: Product) => void;
}

const WatchlistPage: React.FC<WatchlistPageProps> = ({ items, onToggleWatchlist }) => {
  return (
    <main className="min-h-screen bg-eco-pattern relative overflow-hidden pt-20 sm:pt-0">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-eco-200 to-nature-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-nature-200 to-ocean-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-ocean-200 to-eco-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-10 right-10 animate-nature-float">
          <div className="w-12 h-12 bg-gradient-to-br from-eco-300 to-nature-300 rounded-full flex items-center justify-center opacity-80 shadow-lg animate-pulse">
            <Heart className="h-6 w-6 text-eco-600" />
          </div>
        </div>
        <div className="absolute bottom-10 left-10 animate-nature-float animation-delay-2000">
          <div className="w-10 h-10 bg-gradient-to-br from-nature-300 to-ocean-300 rounded-full flex items-center justify-center opacity-80 shadow-lg animate-ping">
            <Star className="h-5 w-5 text-nature-600" />
          </div>
        </div>
        <div className="absolute top-1/3 left-1/4 animate-nature-float animation-delay-1000">
          <div className="w-8 h-8 bg-gradient-to-br from-ocean-300 to-eco-300 rounded-full flex items-center justify-center opacity-80 shadow-lg animate-pulse">
            <Sparkles className="h-4 w-4 text-ocean-600" />
          </div>
        </div>
        <div className="absolute top-2/3 right-1/3 animate-nature-float animation-delay-3000">
          <div className="w-6 h-6 bg-gradient-to-br from-eco-300 to-nature-300 rounded-full flex items-center justify-center opacity-80 shadow-lg animate-ping">
            <Leaf className="h-3 w-3 text-eco-600" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-eco-200 mb-4 sm:mb-6">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
              <span className="text-xs sm:text-sm font-semibold text-eco-700">Your Favorites</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-eco mb-3 sm:mb-4">Watchlist</h1>
            <p className="text-base sm:text-lg lg:text-xl text-eco-600 max-w-3xl mx-auto px-4">Save products you love and revisit them anytime.</p>
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 text-eco-700 hover:text-eco-900 font-semibold text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-16 sm:py-20 lg:py-24 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-eco-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-eco-900 mb-2 sm:mb-3">Your watchlist is empty</h3>
              <p className="text-eco-600 mb-6 sm:mb-8 text-sm sm:text-base px-4">Explore our eco-friendly catalog and add items to your watchlist.</p>
              <Link to="/categories" className="btn-eco px-6 sm:px-8 py-3 inline-flex items-center space-x-2 text-sm sm:text-base">
                <span>Browse Categories</span>
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile Grid - Single Column */}
              <div className="grid grid-cols-1 gap-4 sm:hidden items-stretch">
                {items.map((product, index) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <ProductCard 
                      product={product}
                      onAddToCart={() => {}}
                      isInWatchlist
                      onToggleWatchlist={onToggleWatchlist}
                    />
                  </div>
                ))}
              </div>

              {/* Tablet Grid - Two Columns */}
              <div className="hidden sm:grid lg:hidden grid-cols-2 gap-6">
                {items.map((product, index) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <ProductCard 
                      product={product}
                      onAddToCart={() => {}}
                      isInWatchlist
                      onToggleWatchlist={onToggleWatchlist}
                    />
                  </div>
                ))}
              </div>

              {/* Desktop Grid - Three/Four Columns */}
              <div className="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((product, index) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <ProductCard 
                      product={product}
                      onAddToCart={() => {}}
                      isInWatchlist
                      onToggleWatchlist={onToggleWatchlist}
                    />
                  </div>
                ))}
              </div>

              {/* Clear Watchlist Button */}
              <div className="mt-8 sm:mt-12 text-center px-4">
                <button 
                  onClick={() => items.forEach(p => onToggleWatchlist(p))}
                  className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 border-eco-200 text-eco-700 hover:bg-eco-50 transition-all duration-300 text-sm sm:text-base"
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Clear Watchlist</span>
                </button>
              </div>

              {/* Mobile Summary */}
              <div className="sm:hidden mt-6 px-4">
                <div className="bg-glass-eco rounded-2xl p-4 border border-eco-200 text-center">
                  <div className="text-2xl font-bold text-eco-600 mb-1">{items.length}</div>
                  <div className="text-sm text-eco-700">Item{items.length !== 1 ? 's' : ''} in Watchlist</div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default WatchlistPage;


