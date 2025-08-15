import React, { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products, brands } from '../data/products';
import { CartItem, Product } from '../types';
import { MapPin, Calendar, Award } from 'lucide-react';

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
  
  const brand = brands.find(b => b.id === brandId);
  
  if (!brand) {
    return <Navigate to="/" replace />;
  }

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => 
      product.brand.toLowerCase().replace(/\s+/g, '').toLowerCase() === brandId?.toLowerCase()
    );

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [brandId, searchQuery]);

  return (
    <main className="py-8 sm:py-12 lg:py-16 pt-20 sm:pt-8">
      {/* Brand Header */}
      <section className="relative bg-gradient-to-r from-green-50 to-blue-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg shadow-sm"
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">
                    {brand.name}
                  </h1>
                  <p className="text-sm sm:text-lg text-green-600 font-medium">{brand.specialty}</p>
                </div>
              </div>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6">
                {brand.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <span className="text-xs sm:text-sm">Est. {brand.established}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <span className="text-xs sm:text-sm">{brand.productCount} Products</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <span className="text-xs sm:text-sm">Sustainable</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-48 sm:h-56 lg:h-64 xl:h-80 object-cover rounded-xl sm:rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {brand.name} Products
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            
            <select className="mt-4 sm:mt-0 bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
              <option>Newest First</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-lg sm:text-xl text-gray-600 mb-4">No products found</p>
              <p className="text-sm sm:text-base text-gray-500">Try adjusting your search or check back later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
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
      </section>
    </main>
  );
};

export default BrandPage;