import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Heart, ShoppingCart, Plus, Minus, CheckCircle, Truck, Shield, Leaf, Loader2 } from 'lucide-react';
import { Product, CartItem } from '../types';
import { productApi, transformBackendProduct } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';
import { useHybridProducts } from '../hooks/useHybridData';

interface ProductDetailPageProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onToggleWatchlist: (product: Product) => void;
  isInWatchlist: (productId: string) => boolean;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  cart,
  onAddToCart,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const { data: allProducts } = useHybridProducts();

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        // Try to find product by ID or slug from backend
        try {
          const response = await productApi.getBySlug(productId);
          if (response.data?.product) {
            setProduct(transformBackendProduct(response.data.product));
            setLoading(false);
            return;
          }
        } catch (err) {
          // If not found by slug, try to find in local products
        }

        // Fallback to local products
        const localProduct = allProducts.find(
          p => p.id === productId || p.slug === productId
        );

        if (localProduct) {
          setProduct(localProduct);
        } else {
          showError('Product not found');
          navigate('/');
        }
      } catch (err: any) {
        showError(err.message || 'Failed to load product');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, navigate, allProducts, showError]);

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      showError('Please sign in to submit a review');
      navigate('/signin');
      return;
    }

    if (!reviewRating || !reviewTitle || !reviewComment) {
      showError('Please fill in all review fields');
      return;
    }

    if (!product) return;

    // Use MongoDB _id if available, otherwise use id
    const productId = (product as any)._id || product.id;
    
    // Validate product ID format (should be MongoDB ObjectId format)
    if (!productId || productId.length < 10) {
      showError('Invalid product. Please refresh the page and try again.');
      return;
    }

    setSubmittingReview(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/users/reviews/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit review');
      }

      success('Review submitted successfully!');
      setReviewRating(0);
      setReviewTitle('');
      setReviewComment('');
      setShowReviewForm(false);
      
      // Reload product to get updated reviews
      if (productId) {
        const response = await productApi.getBySlug(productId);
        if (response.data?.product) {
          setProduct(transformBackendProduct(response.data.product));
        }
      }
    } catch (err: any) {
      showError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ProductCardSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = [product.image];
  const cartItem = cart.find(item => item.id === product.id);
  const inWatchlist = isInWatchlist(product.id);

  return (
    <main className="min-h-screen bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-eco-700 hover:text-eco-900 font-semibold transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <img
                src={images[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <button
                onClick={() => onToggleWatchlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all ${
                  inWatchlist
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`h-5 w-5 ${inWatchlist ? 'fill-current' : ''}`} />
              </button>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-eco-500 shadow-lg'
                        : 'border-gray-200 hover:border-eco-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-eco-600 font-medium">{product.brand}</span>
                <span className="text-eco-400">•</span>
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating.toFixed(1)} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-4xl font-bold text-eco-600">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-sm font-semibold text-red-600">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

              {/* Features */}
              {product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-eco-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">In Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600">
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center space-x-2 border-2 border-eco-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-eco-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-eco-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                  product.inStock
                    ? 'bg-gradient-to-r from-eco-500 to-nature-500 text-white hover:shadow-eco-glow-lg transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center justify-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </span>
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-eco-600" />
                  <span className="text-sm text-gray-700">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-eco-600" />
                  <span className="text-sm text-gray-700">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-eco-600" />
                  <span className="text-sm text-gray-700">Eco-Friendly</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            {isAuthenticated && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setReviewRating(rating)}
                        className={`p-2 rounded ${
                          rating <= reviewRating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      >
                        <Star className={`h-6 w-6 ${rating <= reviewRating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-eco-400 focus:ring-2 focus:ring-eco-400/20"
                    placeholder="Review title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-eco-400 focus:ring-2 focus:ring-eco-400/20"
                    placeholder="Write your review..."
                  />
                </div>
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="px-6 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors disabled:opacity-50"
                >
                  {submittingReview ? (
                    <span className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </span>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Reviews List - Placeholder for now */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;

