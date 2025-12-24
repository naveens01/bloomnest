import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Leaf, Sparkles, User, LogIn, Heart, ChevronDown, UserPlus, LogOut, Package } from 'lucide-react';
import { CartItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  cart: CartItem[];
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  watchlistCount: number;
}

const Header: React.FC<HeaderProps> = ({ cart, onCartClick, searchQuery, onSearchChange, watchlistCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navItems = [
    { path: '/', name: 'Home' },
    { path: '/categories', name: 'Categories' },
    { path: '/brands', name: 'Brands' },
    { path: '/about', name: 'About' },
  ];

  return (
    <>
      {/* Enhanced Header with more animations */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-eco-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Enhanced Logo with animations - Fixed spacing */}
            <div className="flex items-center space-x-3 group cursor-pointer hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-eco-500 to-nature-500 rounded-2xl flex items-center justify-center shadow-eco-glow group-hover:shadow-eco-glow-lg transition-all duration-300 animate-pulse-slow">
                  <Leaf className="h-6 w-6 sm:h-7 sm:w-7 text-white animate-spin-slow" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-nature-400 rounded-full animate-ping"></div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gradient-eco group-hover:scale-105 transition-transform duration-300">
                BloomNest
              </span>
            </div>

            {/* Enhanced Navigation with more animations - Fixed spacing */}
            <nav className="hidden md:flex items-center space-x-10 ml-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group text-eco-700 hover:text-eco-600 font-medium transition-colors duration-300"
                >
                  <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                    {item.name}
                  </span>
                  {/* Enhanced animated underline */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-eco-500 to-nature-500 group-hover:w-full transition-all duration-500 ease-out"></div>
                  {/* Floating dot indicator */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-nature-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300"></div>
                </Link>
              ))}
            </nav>

            {/* Enhanced Search Bar with animations - Fixed positioning */}
            <div className="flex-1 max-w-md mx-8 hidden lg:block">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-eco-400 group-hover:text-eco-600 transition-colors duration-300 animate-pulse-slow" />
                <input
                  type="text"
                  placeholder="Search eco-friendly products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        navigate(`/search?q=${encodeURIComponent(value)}`);
                      }
                    }
                  }}
                  className="w-full pl-12 pr-4 py-3 border-2 border-eco-200 rounded-2xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-eco-300 text-base group-hover:shadow-eco-glow"
                  style={{ lineHeight: '48px', paddingTop: '0', paddingBottom: '0' }}
                />
                {/* Enhanced search bar glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-eco-400/20 to-nature-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
              </div>
            </div>

            {/* Enhanced Right Section with more animations - Fixed spacing */}
            <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
              {/* Enhanced Watchlist Button */}
              <button 
                onClick={() => navigate('/watchlist')}
                className="relative group p-2 sm:p-3 rounded-2xl bg-gradient-to-r from-eco-100 to-nature-100 hover:from-eco-200 hover:to-nature-200 transition-all duration-300 hover:scale-110 hover:shadow-eco-glow"
              >
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-eco-600 group-hover:scale-110 transition-transform duration-300 animate-pulse-slow" />
                {watchlistCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {watchlistCount}
                  </div>
                )}
                {/* Floating particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-0 left-1/2 w-1 h-1 bg-eco-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-nature-400 rounded-full animate-ping animation-delay-1000"></div>
                </div>
              </button>

              {/* Enhanced Cart Button */}
              <button 
                onClick={onCartClick}
                className="relative group p-2 sm:p-3 rounded-2xl bg-gradient-to-r from-eco-100 to-nature-100 hover:from-eco-200 hover:to-nature-200 transition-all duration-300 hover:scale-110 hover:shadow-eco-glow"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-eco-600 group-hover:scale-110 transition-transform duration-300" />
                {cart.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-eco-500 to-nature-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {cart.length}
                  </div>
                )}
                {/* Enhanced hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-eco-400/20 to-nature-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-lg"></div>
              </button>

              {/* Enhanced User Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 sm:p-3 rounded-2xl bg-gradient-to-r from-eco-100 to-nature-100 hover:from-eco-200 hover:to-nature-200 transition-all duration-300 hover:scale-110 hover:shadow-eco-glow"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-eco-500 to-nature-500 rounded-full flex items-center justify-center transition-transform duration-300">
                    {isAuthenticated && user ? (
                      <span className="text-white font-semibold text-sm sm:text-base">
                        {user.initials || user.firstName?.[0] || 'U'}
                      </span>
                    ) : (
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    )}
                  </div>
                  <span className="hidden sm:block text-eco-700 font-medium transition-colors duration-300">
                    {isAuthenticated && user ? user.firstName || 'Account' : 'Sign In'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-eco-600 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Enhanced dropdown with animations */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-eco-glow-lg border border-eco-200 z-50">
                    <div className="p-2">
                      {isAuthenticated && user ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-200">
                            <div className="font-semibold text-gray-900">{user.fullName || `${user.firstName} ${user.lastName}`}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                          <Link 
                            to="/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-eco-50 transition-colors duration-200 group/item"
                          >
                            <Package className="h-5 w-5 text-eco-600 group-hover/item:scale-110 transition-transform duration-200" />
                            <span className="text-eco-700 group-hover/item:text-eco-600 transition-colors duration-200">My Orders</span>
                          </Link>
                          <Link 
                            to="/watchlist"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-eco-50 transition-colors duration-200 group/item"
                          >
                            <Heart className="h-5 w-5 text-eco-600 group-hover/item:scale-110 transition-transform duration-200" />
                            <span className="text-eco-700 group-hover/item:text-eco-600 transition-colors duration-200">Watchlist</span>
                          </Link>
                          {user.role === 'admin' && (
                            <Link 
                              to="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-eco-50 transition-colors duration-200 group/item"
                            >
                              <User className="h-5 w-5 text-eco-600 group-hover/item:scale-110 transition-transform duration-200" />
                              <span className="text-eco-700 group-hover/item:text-eco-600 transition-colors duration-200">Admin</span>
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors duration-200 group/item text-left"
                          >
                            <LogOut className="h-5 w-5 text-red-600 group-hover/item:scale-110 transition-transform duration-200" />
                            <span className="text-red-700 group-hover/item:text-red-800 transition-colors duration-200">Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <Link 
                            to="/signup"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-eco-50 transition-colors duration-200 group/item"
                          >
                            <UserPlus className="h-5 w-5 text-eco-600 group-hover/item:scale-110 transition-transform duration-200" />
                            <span className="text-eco-700 group-hover/item:text-eco-600 transition-colors duration-200">Sign Up</span>
                          </Link>
                          <Link 
                            to="/signin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-eco-50 transition-colors duration-200 group/item"
                          >
                            <LogIn className="h-5 w-5 text-eco-600 group-hover/item:scale-110 transition-transform duration-200" />
                            <span className="text-eco-700 group-hover/item:text-eco-600 transition-colors duration-200">Sign In</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-2xl bg-gradient-to-r from-eco-100 to-nature-100 hover:from-eco-200 hover:to-nature-200 transition-all duration-300 hover:scale-110 hover:shadow-eco-glow"
              >
                <Menu className="h-6 w-6 text-eco-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Fixed positioning */}
            <div className="sm:hidden pb-4 px-4 sm:px-6 lg:px-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-eco-400 group-hover:text-eco-600 transition-colors" />
            <input
              type="text"
              placeholder="Search eco-friendly products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value) {
                    navigate(`/search?q=${encodeURIComponent(value)}`);
                  }
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/80 backdrop-blur-sm leading-none"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Sparkles className="h-4 w-4 text-eco-400" />
            </div>
          </div>
        </div>

        {/* Mobile Menu - Fixed positioning */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-eco-200 py-4 bg-glass-eco rounded-b-3xl px-4 sm:px-6 lg:px-8">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className="text-nature-700 hover:text-eco-600 font-semibold px-4 py-3 rounded-xl hover:bg-eco-50 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
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
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-eco-500 to-nature-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-eco-glow-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
                <Link 
                  to="/signin" 
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-nature-500 to-ocean-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-eco-glow-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;