import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Award, Sparkles, ArrowRight, Star, TrendingUp, ShoppingBag, Crown, Target, Lightbulb, Loader2, Grid } from 'lucide-react';
import { useHybridBrands } from '../hooks/useHybridData';
import BrandCard from '../components/BrandCard';

const BrandsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // Default to A-Z sorting

  // Use hybrid data hook to get brands from both static and backend
  // The hook automatically refreshes when page becomes visible or window gains focus
  const { data: brands, loading: brandsLoading, hasBackendData, refresh } = useHybridBrands();

  // Refresh brands when component mounts to get latest data
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const filteredBrands = useMemo(() => {
    let filtered = [...brands]; // Create a new array to ensure reactivity

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(brand =>
        brand.name.toLowerCase().includes(query) ||
        brand.specialty.toLowerCase().includes(query) ||
        brand.description.toLowerCase().includes(query)
      );
    }

    // Sort brands
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'products':
        filtered.sort((a, b) => b.productCount - a.productCount);
        break;
      case 'newest':
        filtered.sort(() => Math.random() - 0.5); // Simulate newest
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [searchQuery, sortBy, brands]); // Include brands in dependencies

  const categories = ['all', 'personal-care', 'home-living', 'fashion', 'food-beverages', 'electronics'];

  return (
    <main className="min-h-screen bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 pt-32 sm:pt-24 md:pt-28">
      {/* Compact Hero Section */}
      <section className="relative bg-gradient-to-br from-eco-600 via-nature-600 to-ocean-600 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <div className="absolute -top-32 sm:-top-48 -right-32 sm:-right-48 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-eco-300 to-nature-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
          <div className="absolute -bottom-32 sm:-bottom-48 -left-32 sm:-left-48 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-nature-300 to-ocean-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute top-32 sm:top-48 left-32 sm:left-48 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-ocean-300 to-eco-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000"></div>
          
          {/* Floating Elements - hidden on mobile */}
          <div className="hidden sm:block absolute top-16 sm:top-24 right-16 sm:right-24 animate-nature-float">
            <div className="w-12 sm:w-20 h-12 sm:h-20 bg-gradient-to-br from-eco-200 to-nature-200 rounded-full flex items-center justify-center opacity-90 shadow-2xl">
              <Crown className="h-6 w-6 sm:h-10 sm:w-10 text-eco-600" />
            </div>
          </div>
          <div className="hidden sm:block absolute bottom-16 sm:bottom-24 left-16 sm:left-24 animate-nature-float animation-delay-2000">
            <div className="w-10 sm:w-16 h-10 sm:h-16 bg-gradient-to-br from-nature-200 to-ocean-200 rounded-full flex items-center justify-center opacity-90 shadow-2xl">
              <Target className="h-5 w-5 sm:h-8 sm:w-8 text-nature-600" />
            </div>
          </div>
          <div className="hidden sm:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-nature-float animation-delay-4000">
            <div className="w-10 sm:w-14 h-10 sm:h-14 bg-gradient-to-br from-ocean-200 to-eco-200 rounded-full flex items-center justify-center opacity-90 shadow-2xl">
              <Lightbulb className="h-5 w-5 sm:h-7 sm:w-7 text-ocean-600" />
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 sm:px-8 py-1.5 sm:py-4 rounded-full border border-white/30 mb-3 sm:mb-8 animate-fade-in-up">
              <Award className="h-3 w-3 sm:h-6 sm:w-6 text-white" />
              <span className="text-xs sm:text-base font-bold text-white">Premium Trusted Brands</span>
            </div>
            
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-8 animate-fade-in-up animation-delay-200">
              Discover Sustainable Brands
            </h1>
            
            <p className="text-sm sm:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4 mb-4 sm:mb-10 animate-fade-in-up animation-delay-400">
              Explore our curated collection of eco-conscious brands committed to sustainability
            </p>
            
            <div className="grid grid-cols-3 gap-3 sm:gap-8 max-w-2xl sm:max-w-4xl mx-auto animate-fade-in-up animation-delay-600">
              <div className="bg-white/20 backdrop-blur-md p-3 sm:p-8 rounded-xl sm:rounded-3xl border border-white/30 shadow-2xl">
                <div className="text-xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-2">{brands.length}</div>
                <div className="text-xs sm:text-base text-white/90">Trusted Brands</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-3 sm:p-8 rounded-xl sm:rounded-3xl border border-white/30 shadow-2xl">
                <div className="text-xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-2">100%</div>
                <div className="text-xs sm:text-base text-white/90">Eco-Certified</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-3 sm:p-8 rounded-xl sm:rounded-3xl border border-white/30 shadow-2xl">
                <div className="text-xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-2">24/7</div>
                <div className="text-xs sm:text-base text-white/90">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Search and Filter Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-eco-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-nature-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Premium Glass Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/50">
            {/* Premium Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-3xl mx-auto group">
                <div className="absolute inset-0 bg-gradient-to-r from-eco-400 to-nature-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center">
                  <Search className="absolute left-5 h-5 w-5 text-eco-600" />
                  <input
                    type="text"
                    placeholder="Search for sustainable brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-14 py-4 text-base bg-white/90 backdrop-blur-sm border-2 border-eco-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-300 placeholder-gray-400"
                  />
                  <Sparkles className="absolute right-5 h-5 w-5 text-eco-500 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Premium Category Filter Buttons - Centered with Better Size */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
                <Grid className="h-4 w-4" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2.5 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`group relative px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-eco-500 via-nature-500 to-ocean-500 text-white shadow-lg shadow-eco-500/50'
                        : 'bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-eco-400 hover:bg-eco-50 shadow-md'
                    }`}
                  >
                    <span className="relative z-10">
                      {category === 'all' ? '✨ All Brands' : category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    {selectedCategory === category && (
                      <div className="absolute inset-0 bg-gradient-to-r from-eco-400 to-nature-400 rounded-xl blur opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Premium Sort Dropdown - Centered */}
            <div className="flex justify-center">
              <div className="relative group w-full sm:w-auto sm:min-w-[320px]">
                <label className="block text-sm font-bold text-gray-700 mb-3 text-center flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none px-6 py-4 pr-12 rounded-2xl border-2 border-eco-200 focus:border-eco-400 focus:ring-4 focus:ring-eco-100 transition-all duration-300 text-base font-semibold text-eco-700 bg-gradient-to-r from-nature-50 to-ocean-50 hover:from-nature-100 hover:to-ocean-100 shadow-lg group-hover:shadow-xl cursor-pointer"
                >
                  <option value="featured">⭐ Featured</option>
                  <option value="name">🔤 A to Z</option>
                  <option value="products">📦 Most Products</option>
                  <option value="newest">✨ Newest</option>
                </select>
                <div className="absolute right-4 top-[52px] pointer-events-none">
                  <svg className="h-5 w-5 text-eco-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grand Brands Grid */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-none mx-auto">
          {brandsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-eco-600 animate-spin" />
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-eco-700 text-lg">No brands found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              {hasBackendData && (
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-700 font-medium">Enhanced with live data</span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredBrands.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default BrandsPage;