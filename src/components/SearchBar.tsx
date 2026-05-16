import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  products: Product[];
  isMobile?: boolean;
}

interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'recent';
  label: string;
  value: string;
  image?: string;
  price?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  products,
  isMobile = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  // Generate suggestions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Show recent searches when input is empty
      const recentSuggestions: SearchSuggestion[] = recentSearches.slice(0, 5).map(search => ({
        type: 'recent',
        label: search,
        value: search,
      }));
      setSuggestions(recentSuggestions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    // Search products
    const matchingProducts = products
      .filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.features.some(f => f.toLowerCase().includes(query))
      )
      .slice(0, 5);

    matchingProducts.forEach(product => {
      newSuggestions.push({
        type: 'product',
        label: product.name,
        value: product.name,
        image: product.image,
        price: product.price,
      });
    });

    // Search categories
    const categories = [...new Set(products.map(p => p.category))];
    const matchingCategories = categories
      .filter(c => c.toLowerCase().includes(query))
      .slice(0, 3);

    matchingCategories.forEach(category => {
      newSuggestions.push({
        type: 'category',
        label: category,
        value: category,
      });
    });

    // Search brands
    const brands = [...new Set(products.map(p => p.brand))];
    const matchingBrands = brands
      .filter(b => b.toLowerCase().includes(query))
      .slice(0, 3);

    matchingBrands.forEach(brand => {
      newSuggestions.push({
        type: 'brand',
        label: brand,
        value: brand,
      });
    });

    setSuggestions(newSuggestions.slice(0, 8));
    setSelectedIndex(-1);
  }, [searchQuery, products, recentSearches]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else if (searchQuery.trim()) {
        handleSearch(searchQuery);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    onSearchChange(query);
    setIsFocused(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product') {
      // Find product and navigate to it
      const product = products.find(p => p.name === suggestion.label);
      if (product) {
        navigate(`/product/${product.id}`);
      }
    } else if (suggestion.type === 'category') {
      navigate(`/categories/${suggestion.value.toLowerCase().replace(/\s+/g, '-')}`);
    } else if (suggestion.type === 'brand') {
      navigate(`/brands/${suggestion.value.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      onSearchChange(suggestion.value);
    }

    // Save to recent searches
    const updated = [suggestion.value, ...recentSearches.filter(s => s !== suggestion.value)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    setIsFocused(false);
  };

  const clearSearch = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'product':
        return <Search className="h-4 w-4 text-eco-500" />;
      case 'category':
      case 'brand':
        return <TrendingUp className="h-4 w-4 text-nature-500" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${isMobile ? 'w-full' : ''}`}>
      <div className="relative group">
        <Search className={`absolute left-3 ${isMobile ? 'sm:left-4' : 'left-4'} top-1/2 transform -translate-y-1/2 h-4 w-4 ${isMobile ? 'sm:h-5 sm:w-5' : 'h-5 w-5'} text-eco-400 group-hover:text-eco-600 transition-colors duration-300 ${!isMobile && 'animate-pulse-slow'}`} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search eco-friendly products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className={`w-full ${isMobile ? 'pl-10 pr-10 py-2.5 text-sm' : 'pl-12 pr-12 py-3 text-base'} border-2 border-eco-200 ${isMobile ? 'rounded-xl' : 'rounded-2xl'} focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 ${isMobile ? 'bg-white/80' : 'bg-white/90'} backdrop-blur-sm hover:bg-white hover:border-eco-300 ${!isMobile && 'group-hover:shadow-eco-glow'}`}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className={`absolute right-3 ${isMobile ? 'sm:right-4' : 'right-4'} top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors`}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
        {!searchQuery && !isMobile && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Sparkles className="h-4 w-4 text-eco-400" />
          </div>
        )}
        {!isMobile && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-eco-400/20 to-nature-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className={`absolute top-full left-0 right-0 mt-2 bg-white ${isMobile ? 'rounded-xl' : 'rounded-2xl'} shadow-eco-glow-lg border border-eco-200 overflow-hidden z-50 animate-slide-up`}>
          <div className="max-h-96 overflow-y-auto">
            {!searchQuery && recentSearches.length > 0 && (
              <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase">Recent Searches</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-eco-600 hover:text-eco-700 font-medium"
                >
                  Clear
                </button>
              </div>
            )}
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.value}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-eco-50 transition-colors text-left ${
                  index === selectedIndex ? 'bg-eco-50' : ''
                }`}
              >
                {suggestion.image ? (
                  <img
                    src={suggestion.image}
                    alt={suggestion.label}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 bg-eco-100 rounded-lg flex items-center justify-center">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.label}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {suggestion.type === 'recent' ? 'Recent search' : suggestion.type}
                  </div>
                </div>
                {suggestion.price && (
                  <div className="text-sm font-semibold text-eco-600">
                    ₹{suggestion.price}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

// Made with Bob
