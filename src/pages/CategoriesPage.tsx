import React, { useState, useMemo } from 'react';
import { categories } from '../data/products';
import { Link } from 'react-router-dom';
import { Leaf, Sparkles, ArrowRight, Star, Award, Clock, Zap, Heart, Filter, Search, Grid, List, ShoppingBag, TrendingUp, Shield, Users } from 'lucide-react';

const CategoriesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const filteredCategories = useMemo(() => {
    let filtered = categories;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
      );
    }

    // Sort categories
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'products':
        filtered.sort((a, b) => b.count - a.count);
        break;
      case 'newest':
        filtered.sort((a, b) => Math.random() - 0.5); // Simulate newest
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [searchQuery, sortBy]);

  return (
    <main className="min-h-screen bg-eco-pattern">
      {/* Enhanced Hero Section */}
      <section className="relative bg-eco-gradient py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-48 sm:w-96 h-48 sm:h-96 bg-eco-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
          <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-48 sm:w-96 h-48 sm:h-96 bg-ocean-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute top-20 sm:top-40 left-20 sm:left-40 w-48 sm:w-96 h-48 sm:h-96 bg-forest-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
          
          {/* Floating eco elements */}
          <div className="absolute top-10 sm:top-20 right-10 sm:right-20 animate-nature-float">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-eco-100 rounded-full flex items-center justify-center opacity-80">
              <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-eco-600" />
            </div>
          </div>
          <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 animate-nature-float animation-delay-2000">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-ocean-100 rounded-full flex items-center justify-center opacity-80">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-ocean-600" />
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-eco-200 mb-6 sm:mb-8">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
              <span className="text-xs sm:text-sm font-semibold text-eco-700">Product Categories</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gradient-eco mb-6 sm:mb-8">
              Shop by Category
          </h1>
            
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-eco-700 max-w-4xl mx-auto leading-relaxed px-4 mb-8 sm:mb-12">
              Explore our carefully curated categories of sustainable products, each designed to make your 
              eco-friendly lifestyle easier and more beautiful. Find exactly what you need for every aspect of sustainable living.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="bg-glass-eco p-4 sm:p-6 rounded-2xl border border-eco-200">
                <div className="text-2xl sm:text-3xl font-bold text-eco-600 mb-1">{categories.length}</div>
                <div className="text-xs sm:text-sm text-eco-700">Categories</div>
              </div>
              <div className="bg-glass-eco p-4 sm:p-6 rounded-2xl border border-eco-200">
                <div className="text-2xl sm:text-3xl font-bold text-eco-600 mb-1">500+</div>
                <div className="text-xs sm:text-sm text-eco-700">Products</div>
              </div>
              <div className="bg-glass-eco p-4 sm:p-6 rounded-2xl border border-eco-200">
                <div className="text-2xl sm:text-3xl font-bold text-eco-600 mb-1">100%</div>
                <div className="text-xs sm:text-sm text-eco-700">Eco-Friendly</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Search and Filter Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="bg-glass-eco rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-eco-200 shadow-eco-glow">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-center">
              {/* Search Bar */}
              <div className="lg:col-span-2">
                <div className="relative group">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-eco-400 group-hover:text-eco-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search product categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-eco-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-eco-300 text-sm sm:text-lg"
                  />
                </div>
              </div>
              
              {/* Sort Dropdown */}
              <div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-eco-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-eco-300 text-sm sm:text-base"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="name">Name: A to Z</option>
                  <option value="products">Product Count</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center space-x-2 bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-eco-200 mb-4 sm:mb-6">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
              <span className="text-xs sm:text-sm font-semibold text-eco-700">Categories Found</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-eco mb-4 sm:mb-6">
              Product Categories
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-eco-600 max-w-3xl mx-auto leading-relaxed px-4">
              {filteredCategories.length} sustainable product categor{filteredCategories.length !== 1 ? 'ies' : 'y'} 
              {searchQuery && ` matching "${searchQuery}"`} - all designed for eco-conscious living
            </p>
          </div>

          {/* Results Summary */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div className="bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-eco-200">
              <span className="text-eco-700 font-semibold text-sm sm:text-base">
                {filteredCategories.length} Categor{filteredCategories.length !== 1 ? 'ies' : 'y'} Found
              </span>
            </div>
            <div className="bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-eco-200">
              <span className="text-eco-700 font-semibold text-sm sm:text-base">100% Eco-Friendly</span>
            </div>
            <div className="bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-eco-200">
              <span className="text-eco-700 font-semibold text-sm sm:text-base">Premium Quality</span>
            </div>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="bg-glass-eco p-8 sm:p-12 rounded-2xl sm:rounded-3xl border border-eco-200 max-w-2xl mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Search className="h-8 w-8 sm:h-10 sm:w-10 text-eco-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-eco-900 mb-3 sm:mb-4">No Categories Found</h3>
                <p className="text-eco-600 mb-6 text-sm sm:text-base">
                  We couldn't find any categories matching your search criteria.
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="btn-eco px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
                >
                  <span>View All Categories</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredCategories.map((category, index) => (
              <div
                key={category.id}
                  className="card-eco rounded-2xl sm:rounded-3xl shadow-eco hover:shadow-eco-glow transition-all duration-500 cursor-pointer group overflow-hidden hover:-translate-y-2 sm:hover:-translate-y-3 animate-fade-in-up border border-eco-200"
                  style={{ animationDelay: `${index * 150}ms` }}
              >
                  <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Eco-friendly overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-eco-900/80 via-eco-900/20 to-transparent group-hover:from-eco-800/90 transition-all duration-500" />
                    
                    {/* Eco-friendly badge */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-glass-eco px-2 sm:px-3 py-1 rounded-full border border-eco-200 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center space-x-1">
                        <Leaf className="h-3 w-3 text-eco-600" />
                        <span className="text-xs font-medium text-eco-700">Eco</span>
                      </div>
                    </div>
                    
                    {/* Product count badge */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-glass px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      <div className="flex items-center space-x-1">
                        <ShoppingBag className="h-3 w-3 text-white" />
                        <span className="text-white">{category.count}</span>
                      </div>
                    </div>
                    
                    {/* Category info overlay */}
                    <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 text-white">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h3 className="text-sm sm:text-lg lg:text-xl font-bold group-hover:scale-105 transition-transform duration-300 line-clamp-2">
                          {category.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="bg-eco-100/20 px-2 sm:px-3 py-1 rounded-full">
                          <span className="text-xs sm:text-sm font-semibold">{category.count} Products</span>
                        </div>
                        <div className="bg-glass px-1 sm:px-2 py-1 rounded-full">
                          <Leaf className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional info card */}
                  <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-eco-50 to-eco-100">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-eco-500 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm font-medium text-eco-700">Sustainable</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full">
                          <span className="text-xs font-medium text-eco-700">Premium</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-eco">{category.count}</span>
                        <span className="text-sm sm:text-lg text-eco-400 font-medium">Products</span>
                      </div>
                      
                      <Link 
                        to={`/category/${category.id}`}
                        className="bg-eco-gradient text-white px-3 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm hover:shadow-eco-glow transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 sm:space-x-2"
                      >
                        <span>Explore</span>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-eco-gradient rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-eco-glow-lg">
            <div className="inline-flex items-center space-x-2 bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-eco-200 mb-6 sm:mb-8">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
              <span className="text-xs sm:text-sm font-semibold text-eco-700">Explore More</span>
                </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Love These Categories?
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-eco-100 mb-6 sm:mb-8 leading-relaxed px-4">
              Discover more sustainable products and join thousands of customers 
              making eco-friendly choices for their homes and lifestyle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/brands" className="btn-eco px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 sm:space-x-3 group hover:shadow-eco-glow-lg bg-white text-eco-600 hover:bg-eco-50">
                <span>Browse Brands</span>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              
              <Link to="/about" className="btn-eco px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 sm:space-x-3 group hover:shadow-eco-glow-lg border-2 border-white text-white hover:bg-white hover:text-eco-600">
                <span>Learn About Us</span>
                <Leaf className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-300" />
              </Link>
              </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CategoriesPage;