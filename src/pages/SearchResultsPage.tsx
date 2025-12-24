import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, X, Loader2, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CartItem, Product } from '../types';
import { useHybridProducts } from '../hooks/useHybridData';
import { productApi, transformBackendProduct } from '../services/api';

interface SearchResultsPageProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleWatchlist: (product: Product) => void;
  isInWatchlist: (productId: string) => boolean;
}

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  cart: _cart,
  onAddToCart,
  searchQuery,
  onSearchChange,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  const queryParams = useQuery();
  const navigate = useNavigate();
  const urlQuery = queryParams.get('q') || '';

  const [localQuery, setLocalQuery] = useState(urlQuery);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'rating'>('relevance');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[] | null>(null);

  const { data: hybridProducts } = useHybridProducts();

  // Keep global search state in sync with URL/search box
  useEffect(() => {
    setLocalQuery(urlQuery);
    if (urlQuery && urlQuery !== searchQuery) {
      onSearchChange(urlQuery);
    }
  }, [urlQuery, onSearchChange, searchQuery]);

  // Load search results from backend, with fallback to hybrid products
  useEffect(() => {
    const effectiveQuery = urlQuery.trim();
    if (!effectiveQuery) {
      setResults(null);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        // Try backend search first (more accurate/relevant)
        const response = await productApi.search(effectiveQuery, 1, 60);
        if (response.data?.products?.length) {
          const transformed = response.data.products.map(transformBackendProduct);
          setResults(transformed);
          return;
        }
      } catch (err) {
        // Ignore and fall back to hybrid products
        console.error('Search API failed, falling back to hybrid products', err);
      } finally {
        setLoading(false);
      }

      // Fallback: filter existing hybrid products
      const lowered = effectiveQuery.toLowerCase();
      const filtered = hybridProducts.filter((product) =>
        product.name.toLowerCase().includes(lowered) ||
        product.brand.toLowerCase().includes(lowered) ||
        product.description.toLowerCase().includes(lowered) ||
        product.features.some((f) => f.toLowerCase().includes(lowered))
      );
      setResults(filtered);
    };

    load();
  }, [urlQuery, hybridProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = localQuery.trim();
    onSearchChange(trimmed);
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
    navigate('/search');
    setResults(null);
  };

  const sortedResults = useMemo(() => {
    if (!results) return [];
    const cloned = [...results];
    switch (sortBy) {
      case 'price-low':
        cloned.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        cloned.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        cloned.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // relevance: keep backend order / fallback order
        break;
    }
    return cloned;
  }, [results, sortBy]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 mb-4">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="hover:text-eco-700">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-gray-900">Search</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient-eco mb-2">Search Results</h1>
            <p className="text-eco-700">
              {urlQuery
                ? `Showing results for "${urlQuery}"`
                : 'Search across all eco-friendly products on BloomNest.'}
            </p>
          </div>

          {/* Local search bar */}
          <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto sm:min-w-[320px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-eco-400" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-10 py-2.5 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 bg-white/90"
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-4 w-4 text-eco-600" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-eco-400"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <div>
            {results ? (
              <span>
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </span>
            ) : (
              <span>Type something to start searching</span>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-eco-600 animate-spin" />
          </div>
        ) : !urlQuery ? (
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center">
            <p className="text-gray-600 mb-4">
              Start by typing a product name, brand, or feature in the search box above.
            </p>
            <p className="text-sm text-gray-500">
              Example: <span className="font-medium">shampoo</span>, <span className="font-medium">bamboo</span>,{' '}
              <span className="font-medium">plastic-free</span>
            </p>
          </div>
        ) : sortedResults.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center">
            <p className="text-gray-700 font-semibold mb-2">No products found</p>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or browse categories to discover eco-friendly products.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors text-sm font-medium"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sortedResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                isInWatchlist={isInWatchlist(product.id)}
                onToggleWatchlist={onToggleWatchlist}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchResultsPage;



