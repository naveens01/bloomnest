import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import PromotionBanner from '../components/PromotionBanner';
import CategoryGrid from '../components/CategoryGrid';
import BrandGrid from '../components/BrandGrid';
import PromotionCards from '../components/PromotionCards';
import ProductCard from '../components/ProductCard';
import TestimonialCarousel from '../components/TestimonialCarousel';
import SEO from '../components/SEO';
import { useHybridProducts, useHybridCategories, useHybridBrands, useHybridFeaturedProducts, useHybridFeaturedCategories } from '../hooks/useHybridData';
import { CartItem, Product } from '../types';
import { Leaf, Sparkles, ArrowRight, Star, TrendingUp, ShoppingCart } from 'lucide-react';

interface HomeProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  searchQuery: string;
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const Home: React.FC<HomeProps> = ({
  cart,
  onAddToCart,
  searchQuery,
  selectedCategory,
  onCategorySelect
}) => {
  const navigate = useNavigate();
  
  // Use hybrid data hooks
  const { data: allProducts, loading: productsLoading, hasBackendData: hasBackendProducts } = useHybridProducts();
  const { data: allCategories, loading: categoriesLoading, hasBackendData: hasBackendCategories } = useHybridCategories();
  const { data: allBrands, loading: brandsLoading, hasBackendData: hasBackendBrands } = useHybridBrands();
  const { data: featuredProducts, loading: featuredLoading, hasBackendData: hasBackendFeatured } = useHybridFeaturedProducts();
  const { data: featuredCategories } = useHybridFeaturedCategories();
  const homeCategories = useMemo(
    () => (featuredCategories.length > 0 ? featuredCategories.slice(0, 6) : allCategories.slice(0, 6)),
    [featuredCategories, allCategories]
  );

  const filteredProducts = useMemo(() => {
    // Default home experience should highlight backend-managed featured products.
    // If user applies category/search filters, fall back to all products.
    const sourceProducts =
      selectedCategory === 'all' && !searchQuery.trim() && featuredProducts.length > 0
        ? featuredProducts
        : allProducts;

    let filtered = sourceProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    return filtered.slice(0, 10); // Show up to 10 featured products on home
  }, [selectedCategory, searchQuery, allProducts, featuredProducts]);

  return (
    <main>
      <SEO
        title="BloomNest - Eco-Friendly Products for a Sustainable Future"
        description="Discover sustainable products from trusted brands that care about our planet. Shop eco-friendly home goods, personal care, fashion, and more at BloomNest."
        keywords="eco-friendly, sustainable, green products, organic, natural, environmentally friendly, zero waste, ethical shopping, sustainable living"
        type="website"
      />
      <Hero />
      
      <PromotionBanner />

      {/* Backend Data Status Indicator */}
      {(hasBackendCategories || hasBackendBrands || hasBackendProducts || hasBackendFeatured) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Enhanced with live data from our database
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Featured Products Section - Moved to top */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 relative overflow-hidden">
        {/* Grand Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-eco-200 to-nature-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-nature-200 to-ocean-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-ocean-200 to-eco-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
          
          {/* Floating Decorative Elements */}
          <div className="absolute top-10 right-10 animate-nature-float">
            <div className="w-12 h-12 bg-gradient-to-br from-eco-300 to-nature-300 rounded-full flex items-center justify-center opacity-80 shadow-lg">
              <Star className="h-6 w-6 text-eco-600" />
            </div>
          </div>
          <div className="absolute bottom-10 left-10 animate-nature-float animation-delay-2000">
            <div className="w-10 h-10 bg-gradient-to-br from-nature-300 to-ocean-300 rounded-full flex items-center justify-center opacity-80 shadow-lg">
              <TrendingUp className="h-5 w-5 text-nature-600" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-eco-400 to-nature-400 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-eco-200 mb-4 sm:mb-6 shadow-eco-glow animate-fade-in-up">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">Most Popular</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gradient-eco mb-4 sm:mb-6 animate-fade-in-up animation-delay-200">
              Featured Products
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-eco-700 max-w-4xl mx-auto leading-relaxed px-4 animate-fade-in-up animation-delay-400">
              Discover our most popular eco-friendly products that customers love. 
              Each product is carefully selected for quality, sustainability, and customer satisfaction
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-eco-400 to-nature-400 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-eco-200 mb-6 sm:mb-8 shadow-eco-glow animate-fade-in-up animation-delay-600">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">
                {filteredProducts.length} Amazing Products Available
              </span>
            </div>
            
            <Link
              to="/products"
              className="bg-gradient-to-r from-eco-500 to-nature-500 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 sm:space-x-3 mx-auto group hover:shadow-eco-glow-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-eco-glow animate-fade-in-up animation-delay-800"
            >
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
            
            <p className="text-eco-600 text-xs sm:text-sm mt-3 sm:mt-4 px-4 animate-fade-in-up animation-delay-1000">
              Join thousands of eco-conscious shoppers making sustainable choices
            </p>
          </div>
        </div>
      </section>

      <CategoryGrid
        categories={homeCategories}
        loading={categoriesLoading}
        hasBackendData={hasBackendCategories}
      />

      <PromotionCards />

      <BrandGrid
        brands={allBrands}
        loading={brandsLoading}
        hasBackendData={hasBackendBrands}
      />

      {/* Customer Reviews Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-eco-pattern">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center space-x-2 bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-eco-200 mb-4 sm:mb-6">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
              <span className="text-xs sm:text-sm font-semibold text-eco-700">Customer Reviews</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-eco mb-4 sm:mb-6">
              What Our Customers Say
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-eco-600 max-w-3xl mx-auto leading-relaxed px-4">
              Real experiences from eco-conscious customers who love our sustainable products. 
              Join thousands of satisfied customers making a positive impact on our planet.
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>
    </main>
  );
};

export default Home;