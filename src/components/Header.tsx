import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Leaf, User, LogIn, Heart, ChevronDown, UserPlus, Shield, LogOut } from 'lucide-react';
import { CartItem, Product } from '../types';
import SearchBar from './SearchBar';

interface HeaderProps {
  cart: CartItem[];
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  watchlistCount: number;
  products: Product[];
}

const Header: React.FC<HeaderProps> = ({ cart, onCartClick, searchQuery, onSearchChange, watchlistCount, products }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const readAuthUser = () => {
      try {
        const rawUser = localStorage.getItem('user');
        setCurrentUser(rawUser ? JSON.parse(rawUser) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    readAuthUser();
    window.addEventListener('storage', readAuthUser);
    return () => window.removeEventListener('storage', readAuthUser);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/signin');
  };

  const navItems = [
    { path: '/', name: 'Home' },
    { path: '/products', name: 'Products' },
    { path: '/categories', name: 'Categories' },
    { path: '/brands', name: 'Brands' },
    { path: '/about', name: 'About' },
  ];

  return (
    <>
      {/* Enhanced Header with more animations */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-eco-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Enhanced Logo with animations - Mobile optimized - Clickable to home */}
            <Link to="/" className="flex items-center space-x-1.5 sm:space-x-3 group cursor-pointer hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-eco-500 to-nature-500 rounded-2xl flex items-center justify-center shadow-eco-glow group-hover:shadow-eco-glow-lg transition-all duration-300 animate-pulse-slow">
                  <Leaf className="h-5 w-5 sm:h-7 sm:w-7 text-white animate-spin-slow" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-nature-400 rounded-full animate-ping"></div>
              </div>
              <span className="text-base sm:text-2xl font-bold text-gradient-eco group-hover:scale-105 transition-transform duration-300">
                BloomNest
              </span>
            </Link>

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

            {/* Compact Search Bar - Desktop */}
            <div className="flex-1 max-w-sm mx-4 hidden lg:block">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                products={products}
                isMobile={false}
              />
            </div>

            {/* Enhanced Right Section - Mobile optimized */}
            <div className="flex items-center space-x-1.5 sm:space-x-4 lg:space-x-6">
              {/* Enhanced Watchlist Button - Mobile optimized */}
              <button
                onClick={() => navigate('/watchlist')}
                className="relative group p-1.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-eco-100 to-nature-100 hover:from-eco-200 hover:to-nature-200 transition-all duration-300 hover:scale-110 hover:shadow-eco-glow"
              >
                <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-eco-600 group-hover:scale-110 transition-transform duration-300 animate-pulse-slow" />
                {watchlistCount > 0 && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-bounce">
                    {watchlistCount}
                  </div>
                )}
                {/* Floating particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-0 left-1/2 w-1 h-1 bg-eco-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-nature-400 rounded-full animate-ping animation-delay-1000"></div>
                </div>
              </button>

              {/* Enhanced Cart Button - Mobile optimized */}
              <button
                onClick={onCartClick}
                className="relative group p-1.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-eco-100 to-nature-100 hover:from-eco-200 hover:to-nature-200 transition-all duration-300 hover:scale-110 hover:shadow-eco-glow"
              >
                <ShoppingCart className="h-4 w-4 sm:h-6 sm:w-6 text-eco-600 group-hover:scale-110 transition-transform duration-300" />
                {cart.length > 0 && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-eco-500 to-nature-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-bounce">
                    {cart.length}
                  </div>
                )}
                {/* Enhanced hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-eco-400/20 to-nature-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-lg"></div>
              </button>

              {/* Enhanced User Profile - Mobile optimized */}
              <div className="relative group">
                <button className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-eco-100 to-nature-100 hover:from-eco-200 hover:to-nature-200 transition-all duration-300 hover:scale-110 hover:shadow-eco-glow">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 bg-gradient-to-r from-eco-500 to-nature-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <User className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <span className="hidden md:block text-eco-700 font-medium group-hover:text-eco-600 transition-colors duration-300 text-sm">
                    {currentUser ? currentUser.firstName || 'Account' : 'Sign In'}
                  </span>
                  <ChevronDown className="hidden sm:block h-4 w-4 text-eco-600 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                
                {/* Enhanced dropdown with animations */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-eco-glow-lg border border-eco-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="p-2">
                    {currentUser ? (
                      <>
                        {currentUser.role === 'admin' && (
                          <Link 
                            to="/admin"
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-eco-50 transition-colors duration-200 group/item"
                          >
                            <Shield className="h-5 w-5 text-eco-600 group-hover/item:scale-110 transition-transform duration-200" />
                            <span className="text-eco-700 group-hover/item:text-eco-600 transition-colors duration-200">Admin</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-eco-50 transition-colors duration-200 group/item text-left"
                        >
                          <LogOut className="h-5 w-5 text-eco-600 group-hover/item:scale-110 transition-transform duration-200" />
                          <span className="text-eco-700 group-hover/item:text-eco-600 transition-colors duration-200">Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/signup"
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-eco-50 transition-colors duration-200 group/item"
                        >
                          <UserPlus className="h-5 w-5 text-eco-600 group-hover/item:scale-110 transition-transform duration-200" />
                          <span className="text-eco-700 group-hover/item:text-eco-600 transition-colors duration-200">Sign Up</span>
                        </Link>
                        <Link 
                          to="/signin"
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-eco-50 transition-colors duration-200 group/item"
                        >
                          <LogIn className="h-5 w-5 text-eco-600 group-hover/item:scale-110 transition-transform duration-200" />
                          <span className="text-eco-700 group-hover/item:text-eco-600 transition-colors duration-200">Sign In</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Mobile Menu Button - Mobile optimized */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 rounded-xl bg-gradient-to-r from-eco-100 to-nature-100 hover:from-eco-200 hover:to-nature-200 transition-all duration-300 hover:scale-110 hover:shadow-eco-glow"
              >
                <Menu className="h-5 w-5 text-eco-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar with autocomplete */}
        <div className="sm:hidden pb-4 px-4">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            products={products}
            isMobile={true}
          />
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
                {currentUser ? (
                  <>
                    {currentUser.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-eco-500 to-nature-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-eco-glow-lg transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Shield className="h-5 w-5" />
                        <span>Admin</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-nature-500 to-ocean-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-eco-glow-lg transition-all duration-300"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;