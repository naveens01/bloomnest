import React, { useState } from 'react';
import { Category } from '../types';
import { Leaf, Sparkles, Award, Database } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import CategoryCard from './CategoryCard';

interface CategoryGridProps {
  categories: Category[];
  loading?: boolean;
  hasBackendData?: boolean;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, loading = false, hasBackendData = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const visibleCategories = categories.slice(0, 6);

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

        {/* Amazon-Style Category Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" text="Loading categories..." />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {visibleCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;