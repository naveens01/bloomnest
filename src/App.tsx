import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Cart from './components/Cart';
import Footer from './components/Footer';
import { CartItem, Product } from './types';
import { AuthProvider } from './contexts/AuthContext';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/Toast';
import { PageSkeleton } from './components/LoadingSkeleton';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const BrandPage = lazy(() => import('./pages/BrandPage'));
const BrandsPage = lazy(() => import('./pages/BrandsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const SigninPage = lazy(() => import('./pages/SigninPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));

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
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<Product[]>(() => {
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem('watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });
  const { toasts, removeToast, success, error } = useToast();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        const updated = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        success(`${product.name} quantity updated in cart`);
        return updated;
      }
      
      const updated = [...prevCart, { ...product, quantity: 1 }];
      success(`${product.name} added to cart`);
      return updated;
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
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === productId);
      if (item) {
        success(`${item.name} removed from cart`);
      }
      return prevCart.filter(item => item.id !== productId);
    });
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
    <AuthProvider>
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
                <Suspense fallback={<PageSkeleton />}>
                  <Home
                    cart={cart}
                    onAddToCart={addToCart}
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                  />
                </Suspense>
              } 
            />
            <Route 
              path="/categories" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <CategoriesPage />
                </Suspense>
              } 
            />
            <Route 
              path="/category/:categoryId" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <CategoryPage
                    cart={cart}
                    onAddToCart={addToCart}
                    searchQuery={searchQuery}
                    onToggleWatchlist={toggleWatchlist}
                    isInWatchlist={(productId: string) => watchlist.some(p => p.id === productId)}
                  />
                </Suspense>
              } 
            />
            <Route 
              path="/brands" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <BrandsPage />
                </Suspense>
              } 
            />
            <Route 
              path="/brand/:brandId" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <BrandPage
                    cart={cart}
                    onAddToCart={addToCart}
                    searchQuery={searchQuery}
                    onToggleWatchlist={toggleWatchlist}
                    isInWatchlist={(productId: string) => watchlist.some(p => p.id === productId)}
                  />
                </Suspense>
              } 
            />
            <Route 
              path="/product/:productId" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <ProductDetailPage
                    cart={cart}
                    onAddToCart={addToCart}
                    onToggleWatchlist={toggleWatchlist}
                    isInWatchlist={(productId: string) => watchlist.some(p => p.id === productId)}
                  />
                </Suspense>
              } 
            />
            <Route 
              path="/about" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <AboutPage />
                </Suspense>
              } 
            />
            <Route 
              path="/watchlist" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <WatchlistPage items={watchlist} onToggleWatchlist={toggleWatchlist} />
                </Suspense>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <OrderHistoryPage />
                </Suspense>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <SignupPage />
                </Suspense>
              } 
            />
            <Route 
              path="/signin" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <SigninPage />
                </Suspense>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <AdminPage />
                </Suspense>
              } 
            />
          </Routes>

          <Footer />

          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={() => setIsCartOpen(false)}
          />

          <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;