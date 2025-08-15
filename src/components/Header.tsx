import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Leaf, Sparkles, User, LogIn, Heart } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cart: CartItem[];
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  watchlistCount: number;
}

const Header: React.FC<HeaderProps> = ({ cart, onCartClick, searchQuery, onSearchChange, watchlistCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-glass-eco backdrop-blur-md border-b border-eco-200 sticky top-0 z-50 shadow-eco-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-eco-gradient rounded-2xl flex items-center justify-center shadow-eco-glow group-hover:shadow-eco-glow-lg transition-all duration-300 group-hover:scale-110">
                  <Leaf className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-earth-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-gradient-eco">EcoMarket</span>
                <span className="text-xs text-eco-600 font-medium -mt-1 hidden sm:block">Sustainable Living</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-12">
            <div className="flex items-center space-x-12">
              <Link
                to="/"
                className={`font-semibold transition-all duration-300 relative group ${
                  location.pathname === '/' ? 'text-eco-600' : 'text-nature-700 hover:text-eco-600'
                }`}
              >
                Home
                {location.pathname === '/' && (
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-eco-gradient rounded-full"></div>
                )}
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-eco-gradient rounded-full transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link
                to="/categories"
                className={`font-semibold transition-all duration-300 relative group ${
                  location.pathname === '/categories' ? 'text-eco-600' : 'text-nature-700 hover:text-eco-600'
                }`}
              >
                Categories
                {location.pathname === '/categories' && (
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-eco-gradient rounded-full"></div>
                )}
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-eco-gradient rounded-full transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link
                to="/brands"
                className={`font-semibold transition-all duration-300 relative group ${
                  location.pathname === '/brands' ? 'text-eco-600' : 'text-nature-700 hover:text-eco-600'
                }`}
              >
                Brands
                {location.pathname === '/brands' && (
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-eco-gradient rounded-full"></div>
                )}
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-eco-gradient rounded-full transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link
                to="/about"
                className={`font-semibold transition-all duration-300 relative group ${
                  location.pathname === '/about' ? 'text-eco-600' : 'text-nature-700 hover:text-eco-600'
                }`}
              >
                About
                {location.pathname === '/about' && (
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-eco-gradient rounded-full"></div>
                )}
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-eco-gradient rounded-full transition-all duration-300 group-hover:w-full"></div>
              </Link>
            </div>
          </nav>

          {/* Desktop Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-eco-400 group-hover:text-eco-600 transition-colors" />
              <input
                type="text"
                placeholder="Search eco-friendly products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 h-12 border-2 border-eco-200 rounded-2xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-eco-300 text-base"
                style={{ 
                  lineHeight: '48px',
                  paddingTop: '0',
                  paddingBottom: '0'
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="h-4 w-4 text-eco-400" />
              </div>
            </div>
          </div>

          {/* User Actions - Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* User Profile - Hidden on mobile */}
            <div className="hidden sm:block relative group">
              <button className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-eco-50 transition-all duration-300 group-hover:shadow-eco-glow">
                <div className="w-10 h-10 bg-eco-gradient rounded-full flex items-center justify-center shadow-eco-glow">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="hidden xl:flex flex-col items-start">
                  <span className="text-sm font-semibold text-eco-900">Guest User</span>
                  <span className="text-xs text-eco-600">Sign in to continue</span>
                </div>
              </button>

              {/* Profile Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-eco-glow-lg border border-eco-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-eco-gradient rounded-full flex items-center justify-center mx-auto mb-2">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-eco-900">Welcome!</h3>
                    <p className="text-sm text-eco-600">Sign in to access your account</p>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to="/signup"
                      className="w-full flex items-center justify-center space-x-2 bg-eco-gradient text-white px-4 py-3 rounded-xl font-semibold hover:shadow-eco-glow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Sign Up / Sign In</span>
                    </Link>

                    <div className="text-center">
                      <p className="text-xs text-eco-500">Join our eco-friendly community</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Watchlist Button */}
            <Link
              to="/watchlist"
              className="relative p-2 sm:p-3 text-nature-700 hover:text-eco-600 transition-all duration-300 group"
            >
              <div className="p-2 bg-eco-50 rounded-xl group-hover:bg-eco-100 group-hover:shadow-eco-glow transition-all duration-300">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              {watchlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
                  {watchlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 sm:p-3 text-nature-700 hover:text-eco-600 transition-all duration-300 group"
            >
              <div className="p-2 bg-eco-50 rounded-xl group-hover:bg-eco-100 group-hover:shadow-eco-glow transition-all duration-300">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-eco-500 to-eco-600 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-nature-700 hover:text-eco-600 transition-colors"
            >
              <div className="p-2 bg-eco-50 rounded-xl hover:bg-eco-100 hover:shadow-eco-glow transition-all duration-300">
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-eco-400 group-hover:text-eco-600 transition-colors" />
            <input
              type="text"
              placeholder="Search eco-friendly products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/80 backdrop-blur-sm leading-none"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Sparkles className="h-4 w-4 text-eco-400" />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-eco-200 py-4 bg-glass-eco rounded-b-3xl">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-nature-700 hover:text-eco-600 font-semibold px-4 py-3 rounded-xl hover:bg-eco-50 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/categories" 
                className="text-nature-700 hover:text-eco-600 font-semibold px-4 py-3 rounded-xl hover:bg-eco-50 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                to="/brands" 
                className="text-nature-700 hover:text-eco-600 font-semibold px-4 py-3 rounded-xl hover:bg-eco-50 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Brands
              </Link>
              <Link 
                to="/about" 
                className="text-nature-700 hover:text-eco-600 font-semibold px-4 py-3 rounded-xl hover:bg-eco-50 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="pt-3 border-t border-eco-200 space-y-3">
                <Link 
                  to="/watchlist" 
                  className="flex items-center justify-center space-x-2 bg-eco-gradient text-white px-4 py-3 rounded-xl font-semibold hover:shadow-eco-glow-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  <span>Watchlist ({watchlistCount})</span>
                </Link>
                <Link 
                  to="/signup" 
                  className="flex items-center justify-center space-x-2 bg-eco-gradient text-white px-4 py-3 rounded-xl font-semibold hover:shadow-eco-glow-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign Up / Sign In</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;