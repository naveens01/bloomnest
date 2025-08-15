import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';
import { Leaf, Sparkles, ArrowRight, Star, Award, Clock, Zap, Heart } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

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
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient-eco mb-6">
            Discover Eco-Friendly Categories
          </h2>
          <p className="text-xl text-eco-600 max-w-3xl mx-auto leading-relaxed">
            Explore our carefully curated categories of sustainable products, each designed to help you 
            make environmentally conscious choices for your lifestyle
          </p>
        </div>

        {/* Enhanced Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 ${
              selectedCategory === 'all'
                ? 'bg-eco-gradient text-white shadow-eco-glow-lg scale-105'
                : 'bg-glass-eco text-eco-700 hover:bg-eco-100 hover:shadow-eco-glow border border-eco-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5" />
              <span>All Categories</span>
            </div>
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 ${
                selectedCategory === category.id
                  ? 'bg-eco-gradient text-white shadow-eco-glow-lg scale-105'
                  : 'bg-glass-eco text-eco-700 hover:bg-eco-100 hover:shadow-eco-glow border border-eco-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Leaf className="h-5 w-5" />
                <span>{category.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Enhanced Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Main Card Container */}
              <div className="card-eco rounded-3xl shadow-eco hover:shadow-eco-glow-xl transition-all duration-700 cursor-pointer overflow-hidden hover:-translate-y-4 border border-eco-200 relative">
                {/* Enhanced Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 ease-out"
                  />
                  
                  {/* Enhanced Overlay with Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-eco-900/90 via-eco-800/50 to-transparent group-hover:from-eco-800/95 transition-all duration-700" />
                  
                  {/* Floating Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-glass-eco backdrop-blur-md p-3 rounded-2xl border border-eco-200/50 shadow-eco-glow group-hover:scale-110 transition-all duration-500">
                      <Leaf className="h-6 w-6 text-eco-600" />
                    </div>
                  </div>
                  
                  {/* Enhanced Eco Badge */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-eco-gradient p-3 rounded-2xl shadow-eco-glow">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-white" />
                        <span className="text-xs font-bold text-white">ECO</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Category Info Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold group-hover:scale-105 transition-transform duration-500">
                        {category.name}
                      </h3>
                      <ArrowRight className="h-7 w-7 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
                    </div>
                    
                                         <div className="flex items-center space-x-4 mb-3">
                       <div className="bg-eco-100/30 backdrop-blur-sm px-4 py-2 rounded-full border border-eco-200/30">
                         <span className="text-sm font-semibold">{category.count} Products</span>
                       </div>
                      <div className="bg-glass-eco backdrop-blur-md px-3 py-2 rounded-full border border-eco-200/50">
                        <Star className="h-4 w-4 text-eco-300" />
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
                
                {/* Enhanced Content Section */}
                <div className="p-8 bg-gradient-to-br from-eco-50 via-white to-eco-50">
                  <div className="mb-6">
                                         <p className="text-eco-700 leading-relaxed text-sm mb-4 line-clamp-2">
                       Discover amazing {category.name.toLowerCase()} products that are sustainable and eco-friendly.
                     </p>
                    
                    {/* Enhanced Feature Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="bg-eco-100 px-3 py-1 rounded-full border border-eco-200">
                        <span className="text-xs font-medium text-eco-700">Sustainable</span>
                      </div>
                      <div className="bg-eco-100 px-3 py-1 rounded-full border border-eco-200">
                        <span className="text-xs font-medium text-eco-700">Natural</span>
                      </div>
                      <div className="bg-eco-100 px-3 py-1 rounded-full border border-eco-200">
                        <span className="text-xs font-medium text-eco-700">Eco-Friendly</span>
                      </div>
                    </div>
                    
                    {/* Enhanced Stats Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-eco-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-eco-700">{category.count} Items</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-eco-500" />
                        <span className="text-xs text-eco-600">Updated Daily</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Action Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-eco-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Zap className="h-5 w-5 text-eco-600" />
                      </div>
                      <span className="text-sm font-medium text-eco-700">Premium Quality</span>
                    </div>
                    
                    {/* Enhanced CTA Button */}
                    <button className="bg-eco-gradient text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:shadow-eco-glow-lg transition-all duration-300 transform hover:scale-105 group-hover:shadow-eco-glow-xl">
                      <span className="flex items-center space-x-2">
                        <span>Explore Now</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Enhanced Hover Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-eco-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </div>
              
              {/* Floating Decorative Elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-eco-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-3000"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-eco-200 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-1500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;