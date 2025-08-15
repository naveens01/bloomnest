import React, { useState, useMemo } from 'react';
import { brands } from '../data/products';
import { Link } from 'react-router-dom';
import { Search, Award, Sparkles, ArrowRight, Star, TrendingUp, ShoppingBag, Crown, Target, Lightbulb } from 'lucide-react';

const BrandsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const filteredBrands = useMemo(() => {
    let filtered = brands;

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
  }, [searchQuery, sortBy]);

  const categories = ['all', 'personal-care', 'home-living', 'fashion', 'food-beverages', 'electronics'];

  return (
    <main className="min-h-screen bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 pt-20 sm:pt-0">
      {/* Grand Hero Section */}
      <section className="relative bg-gradient-to-br from-eco-600 via-nature-600 to-ocean-600 py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Magnificent Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grand Floating Orbs */}
          <div className="absolute -top-32 sm:-top-48 -right-32 sm:-right-48 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-eco-300 to-nature-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
          <div className="absolute -bottom-32 sm:-bottom-48 -left-32 sm:-left-48 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-nature-300 to-ocean-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute top-32 sm:top-48 left-32 sm:left-48 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-ocean-300 to-eco-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000"></div>
          
          {/* Grand Floating Elements */}
          <div className="absolute top-16 sm:top-24 right-16 sm:right-24 animate-nature-float">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-eco-200 to-nature-200 rounded-full flex items-center justify-center opacity-90 shadow-2xl">
              <Crown className="h-8 w-8 sm:h-10 sm:w-10 text-eco-600" />
            </div>
          </div>
          <div className="absolute bottom-16 sm:bottom-24 left-16 sm:left-24 animate-nature-float animation-delay-2000">
            <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-nature-200 to-ocean-200 rounded-full flex items-center justify-center opacity-90 shadow-2xl">
              <Target className="h-7 w-7 sm:h-8 sm:w-8 text-nature-600" />
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-nature-float animation-delay-4000">
            <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-ocean-200 to-eco-200 rounded-full flex items-center justify-center opacity-90 shadow-2xl">
              <Lightbulb className="h-6 w-6 sm:h-7 sm:w-7 text-ocean-600" />
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/30 mb-8 sm:mb-12 animate-fade-in-up">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              <span className="text-sm sm:text-base font-bold text-white">Premium Trusted Brands</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 sm:mb-12 animate-fade-in-up animation-delay-200">
              Discover Sustainable Brands
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-white/90 max-w-5xl mx-auto leading-relaxed px-4 mb-12 sm:mb-16 animate-fade-in-up animation-delay-400">
              Explore our curated collection of eco-conscious brands that are committed to sustainability, 
              quality, and positive environmental impact. Each brand shares our vision for a greener future.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto animate-fade-in-up animation-delay-600">
              <div className="bg-white/20 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/30 shadow-2xl">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{brands.length}</div>
                <div className="text-sm sm:text-base text-white/90">Trusted Brands</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/30 shadow-2xl">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-sm sm:text-base text-white/90">Eco-Certified</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/30 shadow-2xl">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm sm:text-base text-white/90">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grand Search and Filter Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-eco-100 via-nature-100 to-ocean-100 rounded-3xl p-8 sm:p-12 shadow-eco-glow-lg border border-eco-200">
            {/* Search Bar */}
            <div className="mb-8 sm:mb-12">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-eco-600" />
                <input
                  type="text"
                  placeholder="Search for sustainable brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 text-lg border-2 border-eco-200 rounded-2xl focus:ring-4 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-eco-300 shadow-lg"
                />
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="h-5 w-5 text-eco-400" />
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-eco-500 to-nature-500 text-white shadow-eco-glow-lg'
                      : 'bg-white/80 text-eco-700 hover:bg-white hover:shadow-lg border-2 border-eco-200'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {[
                { value: 'featured', label: 'Featured', icon: Star },
                { value: 'name', label: 'Name', icon: TrendingUp },
                { value: 'products', label: 'Products', icon: ShoppingBag },
                { value: 'newest', label: 'Newest', icon: Sparkles }
              ].map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-nature-500 to-ocean-500 text-white shadow-nature-glow-lg'
                        : 'bg-white/80 text-nature-700 hover:bg-white hover:shadow-lg border-2 border-nature-200'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Grand Brands Grid */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-none mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-10">
            {filteredBrands.map((brand, index) => (
              <div
                key={brand.id}
                className="group bg-gradient-to-br from-white to-eco-50 rounded-3xl p-8 sm:p-10 shadow-eco-glow hover:shadow-eco-glow-xl transition-all duration-500 transform hover:scale-105 border border-eco-200 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Brand Header */}
                <div className="text-center mb-6 sm:mb-8">
                  {/* Brand Image */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover rounded-3xl shadow-eco-glow group-hover:shadow-eco-glow-lg transition-all duration-300 group-hover:scale-105"
                    />
                    {/* Brand Logo Overlay */}
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-eco-400 to-nature-400 rounded-2xl flex items-center justify-center shadow-lg">
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-eco-800 mb-2">{brand.name}</h3>
                  <p className="text-sm sm:text-base text-eco-600 mb-3">{brand.specialty}</p>
                  <div className="flex items-center justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-eco-200'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-eco-600">(4.5)</span>
                  </div>
                </div>

                {/* Brand Description */}
                <p className="text-eco-700 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 text-center">
                  {brand.description}
                </p>

                {/* Brand Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 sm:mb-8">
                  <div className="text-center p-3 bg-eco-100 rounded-2xl">
                    <div className="text-lg sm:text-xl font-bold text-eco-700">{brand.productCount}</div>
                    <div className="text-xs sm:text-sm text-eco-600">Products</div>
                  </div>
                  <div className="text-center p-3 bg-nature-100 rounded-2xl">
                    <div className="text-lg sm:text-xl font-bold text-nature-700">Est. {brand.established}</div>
                    <div className="text-xs sm:text-sm text-nature-600">Established</div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to={`/brand/${brand.id}`}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-eco-500 to-nature-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base hover:shadow-eco-glow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span>Explore Brand</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BrandsPage;