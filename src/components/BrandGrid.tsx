import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brand } from '../types';
import { Leaf, Sparkles, ArrowRight, Star, Award, Clock, Zap, Heart, Building2, Shield, Users, Crown, Target, Lightbulb, Database } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface BrandGridProps {
  brands: Brand[];
  loading?: boolean;
  hasBackendData?: boolean;
}

const BrandGrid: React.FC<BrandGridProps> = ({ brands, loading = false, hasBackendData = false }) => {
  const navigate = useNavigate();

  const handleBrandClick = (brand: Brand) => {
    // Use slug if available, otherwise generate from name, fallback to ID
    const brandSlug = (brand as any).slug;
    const finalSlug = brandSlug 
      ? brandSlug.toLowerCase() 
      : (brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || brand.id);
    navigate(`/brand/${finalSlug}`);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 relative overflow-hidden">
      {/* Grand Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-eco-200 to-nature-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-nature-200 to-ocean-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-ocean-200 to-eco-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-10 right-10 animate-nature-float">
          <div className="w-12 h-12 bg-gradient-to-br from-eco-300 to-nature-300 rounded-full flex items-center justify-center opacity-80 shadow-lg">
            <Crown className="h-6 w-6 text-eco-600" />
          </div>
        </div>
        <div className="absolute bottom-10 left-10 animate-nature-float animation-delay-2000">
          <div className="w-10 h-10 bg-gradient-to-br from-nature-300 to-ocean-300 rounded-full flex items-center justify-center opacity-80 shadow-lg">
            <Target className="h-5 w-5 text-nature-600" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-eco-400 to-nature-400 px-6 py-3 rounded-full border border-eco-200 mb-6 shadow-eco-glow">
            <Award className="h-5 w-5 text-white" />
            <span className="text-sm font-semibold text-white">Premium Brands</span>
            {hasBackendData && (
              <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                <Database className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Live</span>
              </div>
            )}
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-eco mb-6">
            Trusted Eco-Friendly Brands
          </h2>
          <p className="text-xl text-eco-700 max-w-4xl mx-auto leading-relaxed">
            Discover trusted brands committed to sustainability and quality. 
            Each brand has been carefully selected for their environmental commitment and product excellence
            {hasBackendData && (
              <span className="block mt-2 text-sm text-green-600">
                ✨ Enhanced with real-time data from our database
              </span>
            )}
          </p>
        </div>

        {/* Amazon-Style Brand Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" text="Loading brands..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.map((brand, index) => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand)}
              className="group relative cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Main Card Container */}
              <div className="bg-gradient-to-br from-white via-eco-50 to-nature-50 rounded-2xl shadow-eco hover:shadow-eco-glow-xl transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-2 border border-eco-200 relative">
                {/* Enhanced Image Section */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 ease-out"
                  />
                  
                  {/* Enhanced Overlay with Grand Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-eco-900/90 via-nature-800/60 to-transparent group-hover:from-eco-800/95 transition-all duration-700" />
                  
                  {/* Floating Brand Logo with Enhanced Design */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/30 shadow-2xl group-hover:scale-110 transition-all duration-500 flex items-center justify-center">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          className="w-16 h-16 object-contain rounded-xl"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Award className="w-16 h-16 text-eco-600" />
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced Eco Badge with Grand Design */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-gradient-to-r from-eco-500 to-nature-500 p-3 rounded-2xl shadow-eco-glow">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-white" />
                        <span className="text-xs font-bold text-white">ECO</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Brand Info Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg sm:text-xl font-bold group-hover:scale-105 transition-transform duration-500 drop-shadow-lg line-clamp-1">
                        {brand.name}
                      </h3>
                      <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 flex-shrink-0" />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                        <span className="text-xs font-semibold">{brand.productCount} Products</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-full border border-white/30">
                        <Star className="h-3 w-3 text-yellow-300" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated Background Elements */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-eco-300 rounded-full animate-ping"></div>
                    <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-nature-200 rounded-full animate-ping animation-delay-1000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-ocean-400 rounded-full animate-ping animation-delay-2000"></div>
                  </div>
                </div>
                
                {/* Enhanced Content Section - Mobile Optimized */}
                <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-eco-50 via-white to-eco-50">
                  <div className="mb-4 sm:mb-6">
                    <p className="text-eco-700 leading-relaxed text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {brand.description}
                    </p>
                    
                    {/* Enhanced Feature Tags - Mobile Optimized */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full border border-eco-200">
                        <span className="text-xs font-medium text-eco-700">{brand.specialty}</span>
                      </div>
                      <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full border border-eco-200">
                        <span className="text-xs font-medium text-eco-700">Est. {brand.established}</span>
                      </div>
                    </div>
                    
                    {/* Enhanced Stats Row - Mobile Optimized */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-eco-500 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm font-semibold text-eco-700">{brand.productCount} Items</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="h-3 w-3 text-eco-500" />
                        <span className="text-xs text-eco-600 hidden sm:inline">Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Action Section - Mobile Optimized */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="bg-eco-200 p-2 sm:p-3 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-eco-700 hidden sm:inline">Premium Brand</span>
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

export default BrandGrid;