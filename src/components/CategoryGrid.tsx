import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';
import { Leaf, Sparkles, ArrowRight, Star, Award, Clock, Zap, Heart, Database } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface CategoryGridProps {
  categories: Category[];
  loading?: boolean;
  hasBackendData?: boolean;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, loading = false, hasBackendData = false }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const visibleCategories = categories.slice(0, 6);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-eco-pattern">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-glass-eco px-6 py-3 rounded-full border border-eco-200 mb-6">
            <Award className="h-5 w-5 text-eco-600" />
            <span className="text-sm font-semibold text-eco-700">Shop by Category</span>
            {hasBackendData && (
              <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                <Database className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Live</span>
              </div>
            )}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient-eco mb-6">
            Discover Eco-Friendly Categories
          </h2>
          <p className="text-xl text-eco-600 max-w-3xl mx-auto leading-relaxed">
            Explore our carefully curated categories of sustainable products, each designed to help you 
            make environmentally conscious choices for your lifestyle
            {hasBackendData && (
              <span className="block mt-2 text-sm text-green-600">
                ✨ Enhanced with real-time data from our database
              </span>
            )}
          </p>
        </div>

        {/* Enhanced Category Filter Buttons - Mobile Optimized */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-12 sm:mb-16 px-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-500 transform hover:scale-105 ${
              selectedCategory === 'all'
                ? 'bg-eco-gradient text-white shadow-eco-glow-lg scale-105'
                : 'bg-glass-eco text-eco-700 hover:bg-eco-100 hover:shadow-eco-glow border border-eco-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="whitespace-nowrap">All</span>
            </div>
          </button>
          
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-500 transform hover:scale-105 ${
                selectedCategory === category.id
                  ? 'bg-eco-gradient text-white shadow-eco-glow-lg scale-105'
                  : 'bg-glass-eco text-eco-700 hover:bg-eco-100 hover:shadow-eco-glow border border-eco-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="whitespace-nowrap text-xs sm:text-sm md:text-base">{category.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Enhanced Category Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" text="Loading categories..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {visibleCategories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Main Card Container */}
              <div className="card-eco rounded-2xl sm:rounded-3xl shadow-eco hover:shadow-eco-glow-xl transition-all duration-700 cursor-pointer overflow-hidden hover:-translate-y-2 sm:hover:-translate-y-4 border border-eco-200 relative">
                {/* Enhanced Image Section - Mobile Optimized */}
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 ease-out"
                  />
                  
                  {/* Enhanced Overlay with Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-eco-900/90 via-eco-800/50 to-transparent group-hover:from-eco-800/95 transition-all duration-700" />
                  
                  {/* Floating Category Badge - Mobile Optimized */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <div className="bg-glass-eco backdrop-blur-md p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-eco-200/50 shadow-eco-glow group-hover:scale-110 transition-all duration-500">
                      <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-eco-600" />
                    </div>
                  </div>
                  
                  {/* Enhanced Eco Badge - Mobile Optimized */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-eco-gradient p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-eco-glow">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        <span className="text-xs font-bold text-white hidden sm:inline">ECO</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Category Info Overlay - Mobile Optimized */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold group-hover:scale-105 transition-transform duration-500">
                        {category.name}
                      </h3>
                      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
                    </div>
                    
                    <div className="flex items-center space-x-2 sm:space-x-4 mb-2 sm:mb-3">
                      <div className="bg-eco-100/30 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-eco-200/30">
                        <span className="text-xs sm:text-sm font-semibold">{category.count} Products</span>
                      </div>
                      <div className="bg-glass-eco backdrop-blur-md px-2 py-1.5 sm:px-3 sm:py-2 rounded-full border border-eco-200/50">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-eco-300" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated Background Elements */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-eco-300 rounded-full animate-ping"></div>
                    <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-eco-200 rounded-full animate-ping animation-delay-1000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-eco-400 rounded-full animate-ping animation-delay-2000"></div>
                  </div>
                </div>
                
                {/* Enhanced Content Section - Mobile Optimized */}
                <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-eco-50 via-white to-eco-50">
                  <div className="mb-4 sm:mb-6">
                    <p className="text-eco-700 leading-relaxed text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      Discover amazing {category.name.toLowerCase()} products that are sustainable and eco-friendly.
                    </p>
                    
                    {/* Enhanced Feature Tags - Mobile Optimized */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full border border-eco-200">
                        <span className="text-xs font-medium text-eco-700">Sustainable</span>
                      </div>
                      <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full border border-eco-200">
                        <span className="text-xs font-medium text-eco-700">Natural</span>
                      </div>
                      <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full border border-eco-200">
                        <span className="text-xs font-medium text-eco-700">Eco-Friendly</span>
                      </div>
                    </div>
                    
                    {/* Enhanced Stats Row - Mobile Optimized */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-eco-500 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm font-semibold text-eco-700">{category.count} Items</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-eco-500" />
                        <span className="text-xs text-eco-600 hidden sm:inline">Updated Daily</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Action Section - Mobile Optimized */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="bg-eco-200 p-2 sm:p-3 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-eco-700 hidden sm:inline">Premium Quality</span>
                    </div>
                    
                    {/* Enhanced CTA Button - Mobile Optimized */}
                    <button className="bg-eco-gradient text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm hover:shadow-eco-glow-lg transition-all duration-300 transform hover:scale-105 group-hover:shadow-eco-glow-xl">
                      <span className="flex items-center space-x-1 sm:space-x-2">
                        <span>Explore</span>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Enhanced Hover Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-eco-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </div>
              
              {/* Floating Decorative Elements - Hidden on mobile for performance */}
              <div className="hidden sm:block absolute -top-2 -right-2 w-4 h-4 bg-eco-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-3000"></div>
              <div className="hidden sm:block absolute -bottom-2 -left-2 w-3 h-3 bg-eco-200 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-1500"></div>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;