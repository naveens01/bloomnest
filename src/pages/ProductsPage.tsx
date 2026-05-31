import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';
import { Package, Search, SlidersHorizontal, Sparkles, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Product } from '../types';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('displayOrder');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;

  const fetchProducts = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/products?limit=${ITEMS_PER_PAGE}&page=${pageNum}&sort=${sortBy}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      const newProducts = data.data?.products || data.products || [];
      
      if (append) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }
      
      // Check if there are more products to load
      setHasMore(newProducts.length === ITEMS_PER_PAGE);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sortBy]);

  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(1, false);
  }, [sortBy, fetchProducts]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage, true);
    }
  }, [page, loadingMore, hasMore, fetchProducts]);

  const sentinelRef = useInfiniteScroll({
    loading: loadingMore,
    hasMore,
    onLoadMore: loadMore,
    threshold: 300
  });

  // Filter products based on search query only
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
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
            onClick={() => {
              setPage(1);
              setProducts([]);
              setHasMore(true);
              fetchProducts(1, false);
            }}
            className="mt-4 px-6 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50">
      {/* Grand Hero Section - Mobile Responsive */}
      <section className="relative bg-gradient-to-br from-eco-600 via-nature-600 to-ocean-600 pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-48 sm:w-96 h-48 sm:h-96 bg-eco-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
          <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-48 sm:w-96 h-48 sm:h-96 bg-ocean-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute top-20 sm:top-40 left-20 sm:left-40 w-48 sm:w-96 h-48 sm:h-96 bg-nature-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* Badge - Extra margin on mobile to clear navbar */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/30 mb-4 sm:mb-6 mt-2 sm:mt-0 animate-fade-in-up">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">Premium Collection</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 animate-fade-in-up animation-delay-200 px-4">
              All Products
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4 mb-6 sm:mb-8 animate-fade-in-up animation-delay-400">
              Discover our complete collection of eco-friendly products for sustainable living
            </p>

            {/* Stats */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/30 animate-fade-in-up animation-delay-600">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">
                {filteredProducts.length} of {products.length} products
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sort Section - Modern & Clean */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-900">Sort Products</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-initial sm:min-w-[240px] px-4 py-2.5 text-sm font-medium border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-eco-500 focus:border-eco-500 transition-all bg-white text-gray-900 hover:border-gray-300 cursor-pointer"
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

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-2xl mb-4 sm:mb-6">
              <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'No products available'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
            >
              Refresh Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
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

            {/* Infinite Scroll Sentinel - Modern Minimal */}
            <div ref={sentinelRef} className="h-20 flex items-center justify-center">
              {loadingMore && (
                <div className="flex flex-col items-center space-y-2 py-8">
                  <Loader2 className="h-7 w-7 text-gray-400 animate-spin" />
                  <p className="text-sm text-gray-600 font-medium">Loading more products...</p>
                </div>
              )}
              {!hasMore && filteredProducts.length > 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <p className="text-sm text-gray-600 font-medium">All products loaded</p>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

// Made with Bob
