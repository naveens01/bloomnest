import React, { useState } from 'react';
import { Filter, X, Star, DollarSign, Package } from 'lucide-react';

export interface FilterOptions {
  priceRange: [number, number];
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'rating';
}

interface ProductFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice?: number;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  maxPrice = 10000,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange] as [number, number];
    newRange[index] = value;
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ ...filters, minRating: rating });
  };

  const handleStockChange = (checked: boolean) => {
    onFilterChange({ ...filters, inStockOnly: checked });
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
  };

  const resetFilters = () => {
    onFilterChange({
      priceRange: [0, maxPrice],
      minRating: 0,
      inStockOnly: false,
      sortBy: 'newest',
    });
  };

  const hasActiveFilters =
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice ||
    filters.minRating > 0 ||
    filters.inStockOnly;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Filters</span>
          {hasActiveFilters && (
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        <X
          className={`h-5 w-5 text-gray-600 transition-transform ${
            isOpen ? 'rotate-0' : 'rotate-45'
          }`}
        />
      </button>

      {/* Filters Content */}
      <div className={`p-4 space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Header */}
        <div className="hidden lg:flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Reset All
            </button>
          )}
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <DollarSign className="h-4 w-4 text-gray-600" />
            <label className="text-sm font-semibold text-gray-900">
              Price Range
            </label>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                min={0}
                max={filters.priceRange[1]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Min"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                min={filters.priceRange[0]}
                max={maxPrice}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Max"
              />
            </div>
            <div className="relative">
              <input
                type="range"
                min={0}
                max={maxPrice}
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>₹{filters.priceRange[0]}</span>
              <span>₹{filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Star className="h-4 w-4 text-gray-600" />
            <label className="text-sm font-semibold text-gray-900">
              Minimum Rating
            </label>
          </div>
          <div className="space-y-2">
            {[4, 3, 2, 1, 0].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  filters.minRating === rating
                    ? 'bg-green-50 border-2 border-green-500'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-700">
                  {rating > 0 ? `${rating}+ Stars` : 'All Ratings'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Package className="h-4 w-4 text-gray-600" />
            <label className="text-sm font-semibold text-gray-900">
              Availability
            </label>
          </div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => handleStockChange(e.target.checked)}
              className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">In Stock Only</span>
          </label>
        </div>

        {/* Mobile Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="lg:hidden w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Reset All Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;

// Made with Bob
