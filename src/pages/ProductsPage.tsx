import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { Package, Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Product } from '../types';

interface ProductsPageProps {
  cart: any[];
  onAddToCart: (product: Product) => void;
  searchQuery: string;
  onToggleWatchlist?: (product: Product) => void;
  isInWatchlist?: (productId: string) => boolean;
}

const ProductsPage: React.FC<ProductsPageProps> = ({
  cart,
  onAddToCart,
  searchQuery,
  onToggleWatchlist,
  isInWatchlist
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('displayOrder');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/products?limit=100&sort=${sortBy}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.data?.products || data.products || []);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('${API_BASE_URL}/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Filter products based on search query and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || 
      product.category?._id === filterCategory ||
      product.category?.slug === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Transform backend product to frontend Product type
  const transformProduct = (backendProduct: any): Product => ({
    id: backendProduct._id,
    name: backendProduct.name,
    brand: backendProduct.brand?.name || 'Unknown Brand',
    price: backendProduct.price?.current || 0,
    originalPrice: backendProduct.price?.original,
    image: backendProduct.images?.[0]?.url || backendProduct.primaryImage || '/placeholder.jpg',
    category: backendProduct.category?.name || 'Uncategorized',
    description: backendProduct.description || '',
    features: backendProduct.features || [],
    inStock: backendProduct.inventory?.isInStock ?? true,
    rating: backendProduct.ratings?.average || 0,
    reviews: backendProduct.ratings?.count || 0
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 px-6 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-12 bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Header Section with animations */}
        <div className="text-center mb-8 sm:mb-12 relative">
          {/* Floating background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-eco-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-nature-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-eco-500 to-nature-500 rounded-3xl mb-4 sm:mb-6 shadow-eco-glow animate-pulse-slow">
              <Package className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-eco mb-4 sm:mb-6 px-2 animate-fade-in">
              All Products
            </h1>
            <p className="text-lg sm:text-xl text-eco-700 max-w-3xl mx-auto px-4 leading-relaxed">
              Discover our complete collection of eco-friendly products for sustainable living
            </p>
            <div className="mt-4 sm:mt-6 inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-eco-200 shadow-lg">
              <Sparkles className="h-5 w-5 text-eco-600" />
              <span className="text-sm font-semibold text-eco-700">
                Showing {filteredProducts.length} of {products.length} products
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Filters Section with gradient background */}
        <div className="mb-8 sm:mb-10 bg-gradient-to-r from-white via-eco-50 to-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8 border-2 border-eco-200 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            
            {/* Category Filter with icon */}
            <div className="flex items-center gap-3 flex-1 group">
              <div className="p-2 bg-eco-100 rounded-xl group-hover:bg-eco-200 transition-colors">
                <Filter className="h-5 w-5 text-eco-600" />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="flex-1 px-4 py-3 text-base border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-500 focus:border-eco-500 transition-all bg-white text-eco-700 font-medium shadow-sm hover:shadow-md cursor-pointer"
              >
                <option value="all">🌿 All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options with icon */}
            <div className="flex items-center gap-3 flex-1 group">
              <div className="p-2 bg-nature-100 rounded-xl group-hover:bg-nature-200 transition-colors">
                <SlidersHorizontal className="h-5 w-5 text-nature-600" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-4 py-3 text-base border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-all bg-white text-eco-700 font-medium shadow-sm hover:shadow-md cursor-pointer"
              >
                <option value="displayOrder">⭐ Default</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="rating">🏆 Top Rated</option>
                <option value="newest">✨ Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Products Grid with stagger animation */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-xl border-2 border-eco-200">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-eco-100 rounded-full mb-6">
              <Search className="h-10 w-10 text-eco-400" />
            </div>
            <h3 className="text-2xl font-bold text-eco-700 mb-3">No products found</h3>
            <p className="text-lg text-eco-600 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'No products available in this category'}
            </p>
            <button
              onClick={() => setFilterCategory('all')}
              className="px-6 py-3 bg-gradient-to-r from-eco-500 to-nature-500 text-white rounded-xl font-semibold hover:shadow-eco-glow transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={transformProduct(product)}
                onAddToCart={onAddToCart}
                isInWatchlist={isInWatchlist ? isInWatchlist(product._id) : false}
                onToggleWatchlist={onToggleWatchlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

// Made with Bob
