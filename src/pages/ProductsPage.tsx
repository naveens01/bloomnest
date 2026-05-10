import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { Package, Search, Filter, SlidersHorizontal } from 'lucide-react';
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
    <div className="min-h-screen pt-28 sm:pt-32 pb-12 bg-gradient-to-b from-eco-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-eco-500 to-nature-500 rounded-2xl mb-3 sm:mb-4 shadow-eco-glow">
            <Package className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-eco mb-3 sm:mb-4 px-2">
            All Products
          </h1>
          <p className="text-base sm:text-lg text-eco-700 max-w-2xl mx-auto px-4">
            Discover our complete collection of eco-friendly products
          </p>
          <div className="mt-3 sm:mt-4 text-sm text-eco-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Filters Section - Improved Mobile Layout */}
        <div className="mb-6 sm:mb-8 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-eco-200">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            
            {/* Category Filter - Compact Mobile */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600 flex-shrink-0" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border-2 border-eco-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all bg-white text-eco-700 font-medium"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options - Compact Mobile */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border-2 border-eco-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all bg-white text-eco-700 font-medium"
              >
                <option value="displayOrder">Default</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-eco-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-eco-700 mb-2">No products found</h3>
            <p className="text-eco-600">
              {searchQuery ? 'Try adjusting your search terms' : 'No products available in this category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
