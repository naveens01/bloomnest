import React from 'react';
import { Brand } from '../types';
import { Award, Crown, Target, Database } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import BrandCard from './BrandCard';

interface BrandGridProps {
  brands: Brand[];
  loading?: boolean;
  hasBackendData?: boolean;
}

const BrandGrid: React.FC<BrandGridProps> = ({ brands, loading = false, hasBackendData = false }) => {

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

        {/* Modern Brand Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" text="Loading brands..." />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandGrid;