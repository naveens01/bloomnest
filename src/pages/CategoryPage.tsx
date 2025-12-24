import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CartItem, Product } from '../types';
import { Leaf, Sparkles, ArrowRight, Star, Award, Clock, Zap, Heart, Filter, Search, Grid, List, ShoppingBag, TrendingUp, Shield, Users, Loader2 } from 'lucide-react';
import { useHybridCategories, useHybridProducts } from '../hooks/useHybridData';

interface CategoryPageProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  searchQuery: string;
  onToggleWatchlist: (product: Product) => void;
  isInWatchlist: (productId: string) => boolean;
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  cart,
  onAddToCart,
  searchQuery,
  onToggleWatchlist,
  isInWatchlist
}) => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  // Use hybrid data hooks
  const { data: categories, loading: categoriesLoading, refresh: refreshCategories } = useHybridCategories();
  const { data: allProducts, loading: productsLoading } = useHybridProducts();
  
  // State to track if we've waited enough for categories to load
  const [hasWaitedForCategories, setHasWaitedForCategories] = useState(false);
  
  // Refresh categories on mount and wait a bit before deciding category doesn't exist
  useEffect(() => {
    refreshCategories();
    
    // Wait a bit for categories to load from backend before giving up
    const timer = setTimeout(() => {
      setHasWaitedForCategories(true);
    }, 1000); // Wait 1 second for categories to load
    
    return () => clearTimeout(timer);
  }, [categoryId, refreshCategories]);
  
  // Find category by ID or slug (slug takes priority for SEO-friendly URLs)
  const category = useMemo(() => {
    if (!categoryId || !categories || categories.length === 0) return null;
    
    // Normalize the categoryId from URL (remove any encoding issues and normalize)
    const normalizedCategoryId = decodeURIComponent(categoryId).toLowerCase().trim();
    
    // Try to find by slug first (most common case for SEO-friendly URLs)
    const categoryBySlug = categories.find(c => {
      const categorySlug = (c as any).slug;
      if (categorySlug) {
        const normalizedSlug = categorySlug.toLowerCase().trim();
        return normalizedSlug === normalizedCategoryId;
      }
      // Generate slug from name if not present
      const generatedSlug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').trim();
      return generatedSlug === normalizedCategoryId;
    });
    if (categoryBySlug) return categoryBySlug;
    
    // Then try to find by exact ID match
    const categoryById = categories.find(c => {
      const categoryIdNormalized = String(c.id).toLowerCase().trim();
      return categoryIdNormalized === normalizedCategoryId || categoryIdNormalized === categoryId?.toLowerCase().trim();
    });
    if (categoryById) return categoryById;
    
    // Try matching by generated slug from name (for static categories without slug)
    const categoryByNameSlug = categories.find(c => {
      const nameSlug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').trim();
      return nameSlug === normalizedCategoryId;
    });
    if (categoryByNameSlug) return categoryByNameSlug;
    
    // Try matching by name (exact match, normalized)
    const categoryByName = categories.find(c => {
      const categoryNameNormalized = c.name.toLowerCase().trim();
      return categoryNameNormalized === normalizedCategoryId;
    });
    if (categoryByName) return categoryByName;
    
    // Debug: log what we're looking for and what we have
    console.log('Category not found. Looking for:', normalizedCategoryId, '(original:', categoryId, ')');
    console.log('Available categories:', categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: (c as any).slug || 'none',
      generatedSlug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').trim()
    })));
    
    return null;
  }, [categories, categoryId]);
  
  // Loading state
  if (categoriesLoading || (!hasWaitedForCategories && (!categories || categories.length === 0))) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 text-eco-600 animate-spin" />
      </div>
    );
  }
  
  // Only redirect if we've waited for categories to load AND category is still not found
  // Don't redirect if we haven't waited yet (categories might still be loading from backend)
  if (!category && hasWaitedForCategories && !categoriesLoading && categories && categories.length > 0) {
    console.log('Category not found after waiting, redirecting to home. categoryId:', categoryId);
    console.log('Available categories:', categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: (c as any).slug || 'none'
    })));
    return <Navigate to="/" replace />;
  }
  
  // If category still not found but we haven't waited yet, show loading
  if (!category && !hasWaitedForCategories) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 text-eco-600 animate-spin" />
      </div>
    );
  }
  
  // If still no category after waiting and categories loaded, redirect
  if (!category && hasWaitedForCategories) {
    return <Navigate to="/" replace />;
  }
  
  // Category not found but we're still waiting - show loading
  if (!category) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 text-eco-600 animate-spin" />
      </div>
    );
  }

  const filteredProducts = useMemo(() => {
    // Filter products by category ID, slug, or name
    let filtered = allProducts.filter(product => {
      // Check if product has categoryId (backend product)
      if ((product as any).categoryId) {
        return (product as any).categoryId === category.id || (product as any).categoryId === categoryId;
      }
      // For static products, category is a string like "personal-care"
      // Match by category slug or name
      const productCategory = product.category.toLowerCase().replace(/\s+/g, '-');
      const categorySlug = (category as any).slug || category.id.toLowerCase().replace(/\s+/g, '-');
      const categoryIdNormalized = categoryId?.toLowerCase().replace(/\s+/g, '-');
      const categoryNameSlug = category.name.toLowerCase().replace(/\s+/g, '-');
      
      return productCategory === categoryIdNormalized || 
             productCategory === categorySlug ||
             productCategory === categoryNameSlug ||
             product.category === categoryId ||
             product.category === category.name.toLowerCase();
    });

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
        filtered.sort((a, b) => Math.random() - 0.5); // Simulate newest
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [categoryId, searchQuery, sortBy, allProducts, category]);

  return (
    <main className="min-h-screen bg-eco-pattern">
      {/* Enhanced Category Header */}
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
          {/* Breadcrumbs */}
          <nav className="text-sm text-eco-900/80 mb-4">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="hover:text-eco-900">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/categories" className="hover:text-eco-900">
                  Categories
                </Link>
              </li>
              <li>/</li>
              <li className="font-semibold">{category.name}</li>
            </ol>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-eco-200 mb-6 sm:mb-8">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
                <span className="text-xs sm:text-sm font-semibold text-eco-700">{category.name}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight mb-6 sm:mb-8">
                <span className="text-eco-900">Discover </span>
                <span className="text-gradient-eco">{category.name}</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-eco-700 mb-6 sm:mb-8 leading-relaxed">
                Explore our carefully curated collection of sustainable {category.name.toLowerCase()} products, 
                each designed to make your eco-friendly lifestyle easier and more beautiful.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-glass-eco p-3 sm:p-4 rounded-2xl border border-eco-200">
                  <div className="text-2xl sm:text-3xl font-bold text-eco-600 mb-1">{category.count}</div>
                  <div className="text-xs sm:text-sm text-eco-700">Products Available</div>
                </div>
                
                <div className="bg-glass-eco p-3 sm:p-4 rounded-2xl border border-eco-200">
                  <div className="text-2xl sm:text-3xl font-bold text-eco-600 mb-1">100%</div>
                  <div className="text-xs sm:text-sm text-eco-700">Eco-Friendly</div>
                </div>
                
                <div className="bg-glass-eco p-3 sm:p-4 rounded-2xl border border-eco-200">
                  <div className="text-2xl sm:text-3xl font-bold text-eco-600 mb-1">4.9</div>
                  <div className="text-xs sm:text-sm text-eco-700">Customer Rating</div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 sm:h-80 lg:h-[500px] object-cover rounded-2xl sm:rounded-3xl shadow-eco-glow-lg group-hover:shadow-eco-glow-xl transition-all duration-700"
                />
                
                {/* Floating category badge */}
                <div className="absolute -top-3 sm:-top-6 -right-3 sm:-right-6 bg-glass-eco p-3 sm:p-4 rounded-2xl border border-eco-200 shadow-eco-glow">
                  <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-eco-600" />
                </div>
                
                {/* Floating stats */}
                <div className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 bg-glass-eco p-3 sm:p-4 rounded-2xl border border-eco-200 shadow-eco-glow">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-eco-600 mb-1">{filteredProducts.length}</div>
                    <div className="text-xs sm:text-sm text-eco-700">Found</div>
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
          <div className="bg-glass-eco rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-eco-200 shadow-eco-glow">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 items-center">
              {/* Search Bar */}
              <div className="lg:col-span-2">
                <div className="relative group">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-eco-400 group-hover:text-eco-600 transition-colors" />
                  <input
                    type="text"
                    placeholder={`Search ${category.name.toLowerCase()} products...`}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-eco-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-eco-300 text-sm sm:text-lg"
                    value={searchQuery}
                    readOnly
                  />
                </div>
              </div>
              
              {/* Sort Dropdown */}
              <div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-eco-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-eco-300 text-sm sm:text-lg"
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
                      ? 'bg-eco-gradient text-white shadow-eco-glow'
                      : 'bg-white/80 text-eco-600 hover:bg-eco-100'
                  }`}
                >
                  <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-eco-gradient text-white shadow-eco-glow'
                      : 'bg-white/80 text-eco-600 hover:bg-eco-100'
                  }`}
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
            <div className="inline-flex items-center space-x-2 bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-eco-200 mb-4 sm:mb-6">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
              <span className="text-xs sm:text-sm font-semibold text-eco-700">Products Found</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-eco mb-4 sm:mb-6">
              {category.name} Collection
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-eco-600 max-w-3xl mx-auto leading-relaxed px-4">
              {filteredProducts.length} sustainable {category.name.toLowerCase()} product{filteredProducts.length !== 1 ? 's' : ''} 
              {searchQuery && ` matching "${searchQuery}"`} - all carefully selected for quality and environmental impact
            </p>
          </div>

          {/* Results Summary */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div className="bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-eco-200">
              <span className="text-eco-700 font-semibold text-sm sm:text-base">
                {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
              </span>
            </div>
            <div className="bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-eco-200">
              <span className="text-eco-700 font-semibold text-sm sm:text-base">100% Eco-Friendly</span>
            </div>
            <div className="bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-eco-200">
              <span className="text-eco-700 font-semibold text-sm sm:text-base">Premium Quality</span>
            </div>
          </div>

          {productsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-eco-600 animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="bg-glass-eco p-8 sm:p-12 rounded-2xl sm:rounded-3xl border border-eco-200 max-w-2xl mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Search className="h-8 w-8 sm:h-10 sm:w-10 text-eco-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-eco-900 mb-3 sm:mb-4">No Products Found</h3>
                <p className="text-eco-600 mb-6 text-sm sm:text-base">
                  We couldn't find any {category.name.toLowerCase()} products matching your search criteria.
                </p>
                <button className="btn-eco px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base">
                  <span>Browse All {category.name}</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </button>
              </div>
            </div>
          ) : (
            <div className={`grid gap-4 sm:gap-6 lg:gap-8 items-stretch ${
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
          <div className="bg-eco-gradient rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-eco-glow-lg">
            <div className="inline-flex items-center space-x-2 bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-eco-200 mb-6 sm:mb-8">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
              <span className="text-xs sm:text-sm font-semibold text-eco-700">Explore More</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Love What You See?
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-eco-100 mb-6 sm:mb-8 leading-relaxed px-4">
              Discover more sustainable {category.name.toLowerCase()} products and join thousands of customers 
              making eco-friendly choices for their homes and lifestyle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-eco px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 sm:space-x-3 group hover:shadow-eco-glow-lg bg-white text-eco-600 hover:bg-eco-50">
                <span>Shop All Categories</span>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              
              <button className="btn-eco px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 sm:space-x-3 group hover:shadow-eco-glow-lg border-2 border-white text-white hover:bg-white hover:text-eco-600">
                <span>Learn About Sustainability</span>
                <Leaf className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CategoryPage;