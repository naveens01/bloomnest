import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Cart from './components/Cart';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import BrandPage from './pages/BrandPage';
import BrandsPage from './pages/BrandsPage';
import CategoriesPage from './pages/CategoriesPage';
import AboutPage from './pages/AboutPage';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import AdminPage from './pages/AdminPage';
import { CartItem, Product } from './types';
import WatchlistPage from './pages/WatchlistPage.tsx';

// ScrollToTop component to handle route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top with smooth animation
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const toggleWatchlist = (product: Product) => {
    setWatchlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* ScrollToTop component to handle route changes */}
        <ScrollToTop />
        
        <Header
          cart={cart}
          onCartClick={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          watchlistCount={watchlist.length}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <Home
                cart={cart}
                onAddToCart={addToCart}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            } 
          />
          <Route 
            path="/categories" 
            element={<CategoriesPage />} 
          />
          <Route 
            path="/category/:categoryId" 
            element={
              <CategoryPage
                cart={cart}
                onAddToCart={addToCart}
                searchQuery={searchQuery}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={(productId: string) => watchlist.some(p => p.id === productId)}
              />
            } 
          />
          <Route 
            path="/brands" 
            element={<BrandsPage />} 
          />
          <Route 
            path="/brand/:brandId" 
            element={
              <BrandPage
                cart={cart}
                onAddToCart={addToCart}
                searchQuery={searchQuery}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={(productId: string) => watchlist.some(p => p.id === productId)}
              />
            } 
          />
          <Route 
            path="/about" 
            element={<AboutPage />} 
          />
          <Route 
            path="/watchlist" 
            element={<WatchlistPage items={watchlist} onToggleWatchlist={toggleWatchlist} />} 
          />
          <Route 
            path="/signup" 
            element={<SignupPage />} 
          />
          <Route 
            path="/signin" 
            element={<SigninPage />} 
          />
          <Route 
            path="/admin" 
            element={<AdminPage />} 
          />
        </Routes>

        <Footer />

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
        />
      </div>
    </Router>
  );
}

export default App;