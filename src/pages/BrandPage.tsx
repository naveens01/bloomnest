import React, { useMemo, useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CartItem, Product } from '../types';
import { MapPin, Calendar, Award, Loader2, Star, Search, Grid, List, Filter, TrendingUp, Sparkles, Leaf, ShoppingBag, ArrowRight, Shield, Heart } from 'lucide-react';
import { useHybridBrands, useHybridProducts } from '../hooks/useHybridData';

interface BrandPageProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  searchQuery: string;
  onToggleWatchlist: (product: Product) => void;
  isInWatchlist: (productId: string) => boolean;
}

const BrandPage: React.FC<BrandPageProps> = ({
  cart: _cart,
  onAddToCart,
  searchQuery,
  onToggleWatchlist,
  isInWatchlist
}) => {
  const { brandId } = useParams<{ brandId: string }>();
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  
  // Use hybrid data hooks
  const { data: brands, loading: brandsLoading, refresh: refreshBrands } = useHybridBrands();
  const { data: allProducts, loading: productsLoading } = useHybridProducts();
  
  // State to track if we've waited enough for brands to load
  const [hasWaitedForBrands, setHasWaitedForBrands] = useState(false);
  
  // Refresh brands on mount and wait a bit before deciding brand doesn't exist
  useEffect(() => {
    refreshBrands();
    
    // Wait a bit for brands to load from backend before giving up
    const timer = setTimeout(() => {
      setHasWaitedForBrands(true);
    }, 1000); // Wait 1 second for brands to load
    
    return () => clearTimeout(timer);
  }, [brandId, refreshBrands]);
  
  // Find brand by ID or slug (slug takes priority for SEO-friendly URLs)
  const brand = useMemo(() => {
    if (!brandId || !brands || brands.length === 0) return null;
    
    // Normalize the brandId from URL (remove any encoding issues and normalize)
    const normalizedBrandId = decodeURIComponent(brandId).toLowerCase().trim();
    
    // Try to find by slug first (most common case for SEO-friendly URLs)
    const brandBySlug = brands.find(b => {
      const brandSlug = (b as any).slug;
      if (brandSlug) {
        const normalizedSlug = brandSlug.toLowerCase().trim();
        return normalizedSlug === normalizedBrandId;
      }
      // Generate slug from name if not present
      const generatedSlug = b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').trim();
      return generatedSlug === normalizedBrandId;
    });
    if (brandBySlug) return brandBySlug;
    
    // Then try to find by exact ID match
    const brandById = brands.find(b => {
      const brandIdNormalized = String(b.id).toLowerCase().trim();
      return brandIdNormalized === normalizedBrandId || brandIdNormalized === brandId?.toLowerCase().trim();
    });
    if (brandById) return brandById;
    
    // Try matching by generated slug from name (for static brands without slug)
    const brandByNameSlug = brands.find(b => {
      const nameSlug = b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').trim();
      return nameSlug === normalizedBrandId;
    });
    if (brandByNameSlug) return brandByNameSlug;
    
    // Try matching by name (exact match, normalized)
    const brandByName = brands.find(b => {
      const brandNameNormalized = b.name.toLowerCase().trim();
      return brandNameNormalized === normalizedBrandId;
    });
    if (brandByName) return brandByName;
    
    // Debug: log what we're looking for and what we have
    console.log('Brand not found. Looking for:', normalizedBrandId, '(original:', brandId, ')');
    console.log('Available brands:', brands.map(b => ({
      id: b.id,
      name: b.name,
      slug: (b as any).slug || 'none',
      generatedSlug: b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').trim()
    })));
    
    return null;
  }, [brands, brandId]);

  // Filter products - must be called before any returns (Rules of Hooks)
  const filteredProducts = useMemo(() => {
    if (!brand) return [];
    
    // Combine global search query with local search
    const effectiveSearchQuery = localSearchQuery.trim() || searchQuery.trim();
    
    // Filter products by brand ID, slug, or name
    let filtered = allProducts.filter(product => {
      // Check if product has brandId (backend product)
      if ((product as any).brandId) {
        return (product as any).brandId === brand.id || (product as any).brandId === brandId;
      }
      // For static products, brand is a string (brand name)
      // Match by brand name or normalized brand name
      const productBrand = product.brand.toLowerCase();
      const brandName = brand.name.toLowerCase();
      const brandIdNormalized = brandId?.toLowerCase().replace(/\s+/g, '');
      const productBrandNormalized = productBrand.replace(/\s+/g, '');
      
      return productBrand === brandName || 
             productBrandNormalized === brandIdNormalized ||
             productBrand === brandId?.toLowerCase();
    });

    // Filter by search query
    if (effectiveSearchQuery) {
      const query = effectiveSearchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort(() => Math.random() - 0.5); // Simulate newest
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [brandId, searchQuery, localSearchQuery, sortBy, allProducts, brand]);

  // Loading state - AFTER all hooks
  // Show loading while brands are loading, but don't redirect yet
  if (brandsLoading || (!hasWaitedForBrands && (!brands || brands.length === 0))) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 text-eco-600 animate-spin" />
      </div>
    );
  }
  
  // Only redirect if we've waited for brands to load AND brand is still not found
  // Don't redirect if we haven't waited yet (brands might still be loading from backend)
  if (!brand && hasWaitedForBrands && !brandsLoading && brands && brands.length > 0) {
    console.log('Brand not found after waiting, redirecting to home. brandId:', brandId);
    console.log('Available brands:', brands.map(b => ({
      id: b.id,
      name: b.name,
      slug: (b as any).slug || 'none',
      generatedSlug: b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').trim()
    })));
    return <Navigate to="/" replace />;
  }
  
  // If brand still not found but we haven't waited yet, show loading
  if (!brand && !hasWaitedForBrands) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 text-eco-600 animate-spin" />
      </div>
    );
  }
  
  // If still no brand after waiting and brands loaded, redirect
  if (!brand && hasWaitedForBrands) {
    return <Navigate to="/" replace />;
  }
  
  // Brand not found but we're still waiting - show loading
  if (!brand) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 text-eco-600 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 pt-20 sm:pt-0">
      {/* Enhanced Brand Header */}
      <section className="relative bg-gradient-to-br from-eco-600 via-nature-600 to-ocean-600 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-48 sm:w-96 h-48 sm:h-96 bg-eco-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
          <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-48 sm:w-96 h-48 sm:h-96 bg-ocean-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute top-20 sm:top-40 left-20 sm:left-40 w-48 sm:w-96 h-48 sm:h-96 bg-nature-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
          
          {/* Floating brand elements */}
          <div className="absolute top-10 sm:top-20 right-10 sm:right-20 animate-nature-float">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-90 border border-white/30">
              <Award className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 animate-nature-float animation-delay-2000">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-90 border border-white/30">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in-up">
              {/* Brand Logo and Badge */}
              <div className="flex items-center space-x-4 sm:space-x-6 mb-6 sm:mb-8">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-white/30 shadow-2xl flex items-center justify-center">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="w-full h-full object-contain"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          // Fallback if image fails to load
                          console.error('Failed to load brand logo:', brand.logo, 'for brand:', brand.name);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.fallback-icon')) {
                            const icon = document.createElement('div');
                            icon.className = 'fallback-icon';
                            icon.innerHTML = '<svg class="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
                            parent.appendChild(icon);
                          }
                        }}
                        onLoad={() => {
                          console.log('Successfully loaded brand logo:', brand.logo, 'for brand:', brand.name);
                        }}
                      />
                    ) : (
                      <Award className="w-full h-full text-white" />
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-eco-400 rounded-full flex items-center justify-center border-2 border-white">
                    <Leaf className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/30 mb-2">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    <span className="text-xs sm:text-sm font-semibold text-white">{brand.specialty || 'Eco-Friendly Brand'}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight">
                    {brand.name}
                  </h1>
                </div>
              </div>
              
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed">
                {brand.description || `Discover premium eco-friendly products from ${brand.name}, a trusted brand committed to sustainability and quality.`}
              </p>
              
              {/* Brand Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white/20 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/30 shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    <span className="text-xs sm:text-sm text-white/80">Established</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{brand.established || '2020'}</div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/30 shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    <span className="text-xs sm:text-sm text-white/80">Products</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{brand.productCount || filteredProducts.length}</div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/30 shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300 fill-current" />
                    <span className="text-xs sm:text-sm text-white/80">Rating</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">4.9</div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="relative group">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-64 sm:h-80 lg:h-[500px] object-cover rounded-2xl sm:rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-700 border-4 border-white/30"
                />
                
                {/* Floating brand badge */}
                <div className="absolute -top-3 sm:-top-6 -right-3 sm:-right-6 bg-white/20 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/30 shadow-2xl">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                
                {/* Floating stats */}
                <div className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 bg-white/20 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/30 shadow-2xl">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white mb-1">{filteredProducts.length}</div>
                    <div className="text-xs sm:text-sm text-white/80">Products Found</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Search and Filter Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-eco-200 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 items-center">
              {/* Search Bar */}
              <div className="lg:col-span-2">
                <div className="relative group">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-eco-400 group-hover:text-eco-600 transition-colors" />
                  <input
                    type="text"
                    placeholder={`Search ${brand.name} products...`}
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-eco-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white hover:bg-eco-50/50 text-sm sm:text-lg"
                  />
                </div>
              </div>
              
              {/* Sort Dropdown */}
              <div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-eco-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white hover:bg-eco-50/50 text-sm sm:text-lg"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-eco-500 to-nature-500 text-white shadow-lg'
                      : 'bg-white text-eco-600 hover:bg-eco-50 border-2 border-eco-200'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-eco-500 to-nature-500 text-white shadow-lg'
                      : 'bg-white text-eco-600 hover:bg-eco-50 border-2 border-eco-200'
                  }`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Products Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-eco-200 mb-4 sm:mb-6 shadow-sm">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
              <span className="text-xs sm:text-sm font-semibold text-eco-700">Products Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-eco-600 to-nature-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              {brand.name} Products
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-eco-600 max-w-3xl mx-auto leading-relaxed px-4">
              {productsLoading ? 'Loading products...' : `${filteredProducts.length} sustainable product${filteredProducts.length !== 1 ? 's' : ''}`}
              {(localSearchQuery || searchQuery) && ` matching "${localSearchQuery || searchQuery}"`}
              {' - all carefully selected for quality and environmental impact'}
            </p>
          </div>

          {/* Results Summary */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div className="bg-white/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-eco-200 shadow-sm">
              <span className="text-eco-700 font-semibold text-sm sm:text-base">
                {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-eco-200 shadow-sm">
              <span className="text-eco-700 font-semibold text-sm sm:text-base">100% Eco-Friendly</span>
            </div>
            <div className="bg-white/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-eco-200 shadow-sm">
              <span className="text-eco-700 font-semibold text-sm sm:text-base">Premium Quality</span>
            </div>
          </div>

          {productsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-eco-600 animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="bg-white/80 backdrop-blur-md p-8 sm:p-12 rounded-2xl sm:rounded-3xl border border-eco-200 max-w-2xl mx-auto shadow-lg">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Search className="h-8 w-8 sm:h-10 sm:w-10 text-eco-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-eco-900 mb-3 sm:mb-4">No Products Found</h3>
                <p className="text-eco-600 mb-6 text-sm sm:text-base">
                  We couldn't find any {brand.name} products matching your search criteria.
                </p>
                <button 
                  onClick={() => setLocalSearchQuery('')}
                  className="bg-gradient-to-r from-eco-500 to-nature-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
                >
                  <span>Clear Search</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    isInWatchlist={isInWatchlist(product.id)}
                    onToggleWatchlist={onToggleWatchlist}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-eco-600 via-nature-600 to-ocean-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/30 mb-6 sm:mb-8">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">Explore More</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Love {brand.name}?
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed px-4">
              Discover more sustainable products from {brand.name} and join thousands of customers 
              making eco-friendly choices for their homes and lifestyle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/brands" 
                className="bg-white text-eco-600 px-8 sm:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 sm:space-x-3 group hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span>Browse All Brands</span>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              
              <Link 
                to="/categories" 
                className="bg-white/10 backdrop-blur-md border-2 border-white text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 sm:space-x-3 group hover:bg-white hover:text-eco-600 transition-all duration-300"
              >
                <span>Explore Categories</span>
                <Leaf className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BrandPage;
