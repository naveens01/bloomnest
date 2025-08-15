import React, { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import PromotionBanner from '../components/PromotionBanner';
import CategoryGrid from '../components/CategoryGrid';
import BrandGrid from '../components/BrandGrid';
import PromotionCards from '../components/PromotionCards';
import ProductCard from '../components/ProductCard';
import { products, categories, brands } from '../data/products';
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
  const filteredProducts = useMemo(() => {
    let filtered = products;

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

    return filtered.slice(0, 8); // Show only 8 products on home page
  }, [selectedCategory, searchQuery]);

  return (
    <main>
      <Hero />
      
      <PromotionBanner />
      
      <CategoryGrid
        categories={categories}
      />

      <PromotionCards />

      <BrandGrid brands={brands} />

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group relative cursor-pointer animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Main Card Container */}
                <div className="bg-gradient-to-br from-white via-eco-50 to-nature-50 rounded-3xl shadow-eco-glow hover:shadow-eco-glow-xl transition-all duration-700 cursor-pointer overflow-hidden hover:-translate-y-4 border border-eco-200 relative h-full">
                  {/* Enhanced Image Section */}
                  <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 ease-out"
                    />
                    
                    {/* Enhanced Overlay with Grand Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-eco-900/90 via-eco-800/60 to-transparent group-hover:from-eco-800/95 transition-all duration-700" />
                    
                    {/* Enhanced Eco-friendly badge */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-eco-500 to-nature-500 px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 shadow-eco-glow">
                      <div className="flex items-center space-x-2">
                        <Leaf className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        <span className="text-xs font-bold text-white">ECO</span>
                      </div>
                    </div>
                    
                    {/* Enhanced Discount badge */}
                    {product.originalPrice && (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold animate-pulse shadow-lg">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                    
                    {/* Enhanced Product info overlay */}
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-sm sm:text-lg lg:text-xl font-bold group-hover:scale-105 transition-transform duration-500 line-clamp-2 drop-shadow-lg">
                          {product.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-white/30">
                          <span className="text-xs sm:text-sm font-semibold">{product.brand}</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-white/30">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-300" />
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
                  
                  {/* Enhanced Content Section */}
                  <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
                    {/* Rating and Sustainability Row */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-eco-500 to-nature-500 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm font-medium text-eco-700">Sustainable</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-eco-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-eco-600 font-medium">({product.reviews})</span>
                      </div>
                    </div>
                    
                    {/* Price and Add to Cart Row */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-eco">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm sm:text-lg text-nature-400 line-through font-medium">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="bg-gradient-to-r from-eco-500 to-nature-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold text-xs sm:text-sm hover:shadow-eco-glow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-eco-glow flex-shrink-0 ml-3"
                      >
                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* Enhanced Feature Tags */}
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                      <div className="bg-gradient-to-r from-eco-100 to-nature-100 px-2 sm:px-3 py-1 rounded-full border border-eco-200 shadow-sm">
                        <span className="text-xs font-medium text-eco-700">Premium</span>
                      </div>
                      <div className="bg-gradient-to-r from-nature-100 to-ocean-100 px-2 sm:px-3 py-1 rounded-full border border-nature-200 shadow-sm">
                        <span className="text-xs font-medium text-nature-700">Eco-Friendly</span>
                      </div>
                      <div className="bg-gradient-to-r from-ocean-100 to-eco-100 px-2 sm:px-3 py-1 rounded-full border border-ocean-200 shadow-sm">
                        <span className="text-xs font-medium text-ocean-700">Quality</span>
                      </div>
                    </div>

                    {/* Product Description */}
                    <div className="flex-1">
                      <p className="text-eco-700 text-xs sm:text-sm leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Enhanced Hover Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-eco-400/10 via-nature-400/10 to-ocean-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  </div>
                  
                  {/* Floating Decorative Elements */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-eco-400 to-nature-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-3000"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-nature-400 to-ocean-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-1500"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-eco-400 to-nature-400 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-eco-200 mb-6 sm:mb-8 shadow-eco-glow animate-fade-in-up animation-delay-600">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">
                {filteredProducts.length} Amazing Products Available
              </span>
            </div>
            
            <button className="bg-gradient-to-r from-eco-500 to-nature-500 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 sm:space-x-3 mx-auto group hover:shadow-eco-glow-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-eco-glow animate-fade-in-up animation-delay-800">
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            
            <p className="text-eco-600 text-xs sm:text-sm mt-3 sm:mt-4 px-4 animate-fade-in-up animation-delay-1000">
              Join thousands of eco-conscious shoppers making sustainable choices
            </p>
          </div>
        </div>
      </section>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Review Card 1 */}
            <div className="card-eco rounded-2xl sm:rounded-3xl shadow-eco hover:shadow-eco-glow transition-all duration-500 cursor-pointer group overflow-hidden hover:-translate-y-2 sm:hover:-translate-y-3 animate-fade-in-up border border-eco-200">
              {/* Customer Image Section - Half of Card */}
              <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face"
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay with customer info */}
                <div className="absolute inset-0 bg-gradient-to-t from-eco-800/80 via-eco-700/40 to-transparent group-hover:from-eco-700/90 transition-all duration-500" />
                
                {/* Customer name and rating overlay */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 group-hover:scale-105 transition-transform duration-300">
                    Sarah Johnson
                  </h3>
                  <p className="text-eco-100 text-xs sm:text-sm mb-1 sm:mb-2">Eco Lifestyle Blogger</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-eco-400 text-eco-400" />
                    ))}
                  </div>
                </div>
                
                {/* Eco badge */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-glass-eco p-1 sm:p-2 rounded-xl border border-eco-200 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Leaf className="h-3 w-3 sm:h-4 sm:w-4 text-eco-600" />
                </div>
              </div>
              
              {/* Review Content Section */}
              <div className="p-3 sm:p-4 lg:p-6">
                {/* Review Text */}
                <div className="mb-3 sm:mb-4">
                  <p className="text-eco-700 leading-relaxed text-xs sm:text-sm mb-2 sm:mb-3">
                    "I've been using these eco-friendly products for months now, and I'm absolutely amazed by the quality! 
                    The bamboo toothbrush feels premium, and knowing I'm reducing plastic waste makes me feel good about my choices."
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-eco-700">Verified Purchase</span>
                    </div>
                    <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-eco-700">3 months ago</span>
                    </div>
                  </div>
                </div>

                {/* Product Mentioned */}
                <div className="bg-gradient-to-r from-eco-50 to-eco-100 p-2 sm:p-3 rounded-xl border border-eco-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-eco-200 rounded-lg flex items-center justify-center">
                      <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-eco-800">Bamboo Toothbrush Set</p>
                      <p className="text-xs text-eco-600">4-pack, Natural Bristles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="card-eco rounded-2xl sm:rounded-3xl shadow-eco hover:shadow-eco-glow transition-all duration-500 cursor-pointer group overflow-hidden hover:-translate-y-2 sm:hover:-translate-y-3 animate-fade-in-up border border-eco-200" style={{ animationDelay: '150ms' }}>
              {/* Customer Image Section - Half of Card */}
              <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face"
                  alt="Michael Chen"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay with customer info */}
                <div className="absolute inset-0 bg-gradient-to-t from-eco-800/80 via-eco-700/40 to-transparent group-hover:from-eco-700/90 transition-all duration-500" />
                
                {/* Customer name and rating overlay */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 group-hover:scale-105 transition-transform duration-300">
                    Michael Chen
                  </h3>
                  <p className="text-eco-100 text-xs sm:text-sm mb-1 sm:mb-2">Sustainability Consultant</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-eco-400 text-eco-400" />
                    ))}
                  </div>
                </div>
                
                {/* Eco badge */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-glass-eco p-1 sm:p-2 rounded-xl border border-eco-200 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Leaf className="h-3 w-3 sm:h-4 sm:w-4 text-eco-600" />
                </div>
              </div>
              
              {/* Review Content Section */}
              <div className="p-3 sm:p-4 lg:p-6">
                {/* Review Text */}
                <div className="mb-3 sm:mb-4">
                  <p className="text-eco-700 leading-relaxed text-xs sm:text-sm mb-2 sm:mb-3">
                    "As someone who advises companies on sustainability, I'm impressed by the attention to detail. 
                    The packaging is completely plastic-free, and the products perform better than conventional alternatives."
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-eco-700">Verified Purchase</span>
                    </div>
                    <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-eco-700">1 month ago</span>
                    </div>
                  </div>
                </div>

                {/* Product Mentioned */}
                <div className="bg-gradient-to-r from-eco-50 to-eco-100 p-2 sm:p-3 rounded-xl border border-eco-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-eco-200 rounded-lg flex items-center justify-center">
                      <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-eco-800">Organic Cotton Towels</p>
                      <p className="text-xs text-eco-600">Set of 4, GOTS Certified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Card 3 */}
            <div className="card-eco rounded-2xl sm:rounded-3xl shadow-eco hover:shadow-eco-glow transition-all duration-500 cursor-pointer group overflow-hidden hover:-translate-y-2 sm:hover:-translate-y-3 animate-fade-in-up border border-eco-200" style={{ animationDelay: '300ms' }}>
              {/* Customer Image Section - Half of Card */}
              <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face"
                  alt="Emma Rodriguez"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay with customer info */}
                <div className="absolute inset-0 bg-gradient-to-t from-eco-800/80 via-eco-700/40 to-transparent group-hover:from-eco-700/90 transition-all duration-500" />
                
                {/* Customer name and rating overlay */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 group-hover:scale-105 transition-transform duration-300">
                    Emma Rodriguez
                  </h3>
                  <p className="text-eco-100 text-xs sm:text-sm mb-1 sm:mb-2">Yoga Instructor</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-eco-400 text-eco-400" />
                    ))}
                  </div>
                </div>
                
                {/* Eco badge */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-glass-eco p-1 sm:p-2 rounded-xl border border-eco-200 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Leaf className="h-3 w-3 sm:h-4 sm:w-4 text-eco-600" />
                </div>
              </div>
              
              {/* Review Content Section */}
              <div className="p-3 sm:p-4 lg:p-6">
                {/* Review Text */}
                <div className="mb-3 sm:mb-4">
                  <p className="text-eco-700 leading-relaxed text-xs sm:text-sm mb-2 sm:mb-3">
                    "I love how these products align with my yoga practice and mindful living. 
                    The natural ingredients feel gentle on my skin, and the sustainable packaging makes me feel connected to nature."
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-eco-700">Verified Purchase</span>
                    </div>
                    <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-eco-700">2 weeks ago</span>
                    </div>
                  </div>
                </div>

                {/* Product Mentioned */}
                <div className="bg-gradient-to-r from-eco-50 to-eco-100 p-2 sm:p-3 rounded-xl border border-eco-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-eco-200 rounded-lg flex items-center justify-center">
                      <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-eco-800">Natural Body Wash</p>
                      <p className="text-xs text-eco-600">Lavender & Aloe, 16oz</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Stats */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="bg-glass-eco p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-eco-200">
                <div className="text-2xl sm:text-3xl font-bold text-eco-600 mb-1 sm:mb-2">4.9</div>
                <div className="flex items-center justify-center space-x-1 mb-1 sm:mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-eco-400 text-eco-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-eco-700">Average Rating</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-glass-eco p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-eco-200">
                <div className="text-2xl sm:text-3xl font-bold text-eco-600 mb-1 sm:mb-2">15K+</div>
                <p className="text-xs sm:text-sm text-eco-700">Happy Customers</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-glass-eco p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-eco-200">
                <div className="text-2xl sm:text-3xl font-bold text-eco-600 mb-1 sm:mb-2">98%</div>
                <p className="text-xs sm:text-sm text-eco-700">Satisfaction Rate</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-glass-eco p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-eco-200">
                <div className="text-2xl sm:text-3xl font-bold text-eco-600 mb-1 sm:mb-2">24/7</div>
                <p className="text-xs sm:text-sm text-eco-700">Customer Support</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 sm:mt-16">
            <button className="btn-eco px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 sm:space-x-3 mx-auto group hover:shadow-eco-glow-lg">
              <span>Read More Reviews</span>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;