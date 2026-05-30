import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Leaf, Shield, ArrowLeft, Check, Truck, Package, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, Review, ReviewStats } from '../types';
import { useHybridProducts } from '../hooks/useHybridData';
import { reviewApi, productApi, transformBackendProduct } from '../services/api';
import ReviewSection from '../components/ReviewSection';

interface ProductDetailPageProps {
  onAddToCart: (product: Product) => void;
  onToggleWatchlist: (product: Product) => void;
  isInWatchlist: (productId: string) => boolean;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onAddToCart, onToggleWatchlist, isInWatchlist }) => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: products, loading } = useHybridProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewPagination, setReviewPagination] = useState<any>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      // Try to fetch from API first to get populated category data
      try {
        const response = await productApi.getBySlug(productId);
        if (response.data && response.data.product) {
          const transformedProduct = transformBackendProduct(response.data.product);
          setProduct(transformedProduct);
          setSelectedImage(0);
          return;
        }
      } catch (error) {
        console.log('Product not found in API, trying local data');
      }
      
      // Fallback to local products
      const foundProduct = products.find(p => p.id === productId || (p as any).slug === productId);
      setProduct(foundProduct || null);
      if (foundProduct) {
        setSelectedImage(0);
      }
    };
    
    loadProduct();
  }, [productId, products]);

  // Load reviews when product changes
  useEffect(() => {
    if (product && (product as any).slug) {
      loadReviews((product as any).slug, reviewPage);
    }
  }, [product, reviewPage]);

  const loadReviews = async (slug: string, page: number) => {
    setReviewsLoading(true);
    try {
      const response = await reviewApi.getProductReviews(slug, page, 5);
      if (response.data) {
        setReviews(response.data.reviews || []);
        
        // Get stats from Review collection
        const reviewCollectionStats = response.data.stats || {
          averageRating: 0,
          totalReviews: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
        
        // Get initial ratings from product (admin-added)
        const productRatings = (product as any).ratings || {
          average: 0,
          count: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
        
        // Combine both sources
        const totalReviews = reviewCollectionStats.totalReviews + (productRatings.count || 0);
        const combinedDistribution = {
          1: (reviewCollectionStats.distribution[1] || 0) + (productRatings.distribution?.[1] || 0),
          2: (reviewCollectionStats.distribution[2] || 0) + (productRatings.distribution?.[2] || 0),
          3: (reviewCollectionStats.distribution[3] || 0) + (productRatings.distribution?.[3] || 0),
          4: (reviewCollectionStats.distribution[4] || 0) + (productRatings.distribution?.[4] || 0),
          5: (reviewCollectionStats.distribution[5] || 0) + (productRatings.distribution?.[5] || 0)
        };
        
        // Calculate combined average rating
        let combinedAverage = 0;
        if (totalReviews > 0) {
          const totalRatingPoints =
            (combinedDistribution[1] * 1) +
            (combinedDistribution[2] * 2) +
            (combinedDistribution[3] * 3) +
            (combinedDistribution[4] * 4) +
            (combinedDistribution[5] * 5);
          combinedAverage = totalRatingPoints / totalReviews;
        }
        
        setReviewStats({
          averageRating: combinedAverage,
          totalReviews: totalReviews,
          ratingDistribution: combinedDistribution
        });
        setReviewPagination(response.data.pagination || null);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewPageChange = (page: number) => {
    setReviewPage(page);
    // Scroll to reviews section
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-eco-pattern pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-eco-pattern pt-24 px-4">
        <div className="max-w-7xl mx-auto text-center py-20">
          <Package className="h-16 w-16 text-eco-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-eco-900 mb-4">Product Not Found</h2>
          <p className="text-eco-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/" className="btn-eco inline-flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  // Use product images array if available, otherwise fallback to main image
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image];
  
  // Debug: Log images to console
  console.log('Product images:', images);
  console.log('Product object:', product);
  
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 pt-20 sm:pt-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-eco-600">
          <Link to="/" className="hover:text-eco-800 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-eco-800 transition-colors">Categories</Link>
          <span>/</span>
          {(product as any).category?.name && (
            <>
              <Link
                to={`/category/${(product as any).category.slug || (product as any).category._id}`}
                className="hover:text-eco-800 transition-colors truncate max-w-[120px] sm:max-w-none"
              >
                {(product as any).category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-eco-800 font-medium truncate max-w-[150px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-eco-glow overflow-hidden border-2 border-eco-200 group">
              <div className="aspect-square relative">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows - Hidden on mobile, visible on hover on desktop */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-eco-600" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-eco-600" />
                </button>

                {/* Badges */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col space-y-1.5 sm:space-y-2">
                  <div className="bg-gradient-to-r from-eco-500 to-nature-500 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold shadow-lg">
                    ECO
                  </div>
                  {discountPercentage > 0 && (
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-lg">
                      {discountPercentage}% OFF
                    </div>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWatchlist(product)}
                  className={`absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 ${
                    isInWatchlist(product.id)
                      ? 'bg-red-500 text-white scale-110'
                      : 'bg-white/90 backdrop-blur-sm text-eco-600 hover:bg-red-500 hover:text-white hover:scale-110'
                  }`}
                >
                  <Heart className={`h-5 w-5 sm:h-6 sm:w-6 ${isInWatchlist(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Thumbnail Images - Always show, visible on all devices with smaller size */}
            <div className={`grid gap-2 sm:gap-3 ${
              images.length === 1 ? 'grid-cols-1 max-w-[100px]' :
              images.length === 2 ? 'grid-cols-2 max-w-[220px]' :
              images.length === 3 ? 'grid-cols-3 max-w-[330px]' :
              images.length === 4 ? 'grid-cols-4 max-w-[440px]' :
              'grid-cols-5 max-w-[550px]'
            }`}>
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? 'border-eco-500 shadow-eco-glow scale-105'
                      : 'border-eco-200 hover:border-eco-400'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Brand */}
            <div className="flex items-center space-x-2">
              <div className="bg-eco-100 p-2 rounded-lg">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
              </div>
              <span className="text-sm sm:text-base text-eco-700 font-semibold">{product.brand}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-eco-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm sm:text-base text-eco-700 font-medium">{product.rating}</span>
              <span className="text-xs sm:text-sm text-eco-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="text-3xl sm:text-4xl font-bold text-eco-600">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl sm:text-2xl text-gray-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>

            {/* Description */}
            <div className="bg-gradient-to-br from-eco-50 to-nature-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-eco-200">
              <p className="text-sm sm:text-base text-eco-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-eco-900">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2 bg-white rounded-lg sm:rounded-xl p-3 border border-eco-200">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600 flex-shrink-0 mt-0.5" />
                    <span className="text-eco-700 text-xs sm:text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Eco Benefits */}
            <div className="bg-gradient-to-r from-eco-100 to-nature-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-eco-200">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
                <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-eco-600" />
                <h3 className="text-base sm:text-lg font-semibold text-eco-900">Eco-Friendly Benefits</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-eco-600 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-eco-700 font-medium">Certified Organic</p>
                </div>
                <div className="text-center">
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-eco-600 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-eco-700 font-medium">Plastic-Free</p>
                </div>
                <div className="text-center">
                  <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-eco-600 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-eco-700 font-medium">Carbon Neutral</p>
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <span className="text-sm sm:text-base text-eco-700 font-medium">Quantity:</span>
                <div className="flex items-center space-x-2 sm:space-x-3 bg-white rounded-lg sm:rounded-xl border-2 border-eco-200 p-2 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-eco-100 hover:bg-eco-200 text-eco-700 font-bold transition-colors text-sm sm:text-base"
                  >
                    -
                  </button>
                  <span className="w-10 sm:w-12 text-center font-semibold text-eco-900 text-sm sm:text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-eco-100 hover:bg-eco-200 text-eco-700 font-bold transition-colors text-sm sm:text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 ${
                    product.inStock
                      ? addedToCart
                        ? 'bg-green-600 text-white'
                        : 'bg-gradient-to-r from-eco-500 to-nature-500 text-white hover:shadow-eco-glow-lg hover:scale-105'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-eco-200 space-y-3">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-eco-600 flex-shrink-0" />
                <div>
                  <p className="text-sm sm:text-base font-semibold text-eco-900">Free Shipping</p>
                  <p className="text-xs sm:text-sm text-eco-600">On orders over ₹50</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-eco-600 flex-shrink-0" />
                <div>
                  <p className="text-sm sm:text-base font-semibold text-eco-900">Easy Returns</p>
                  <p className="text-xs sm:text-sm text-eco-600">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <ReviewSection
            reviews={reviews}
            stats={reviewStats}
            pagination={reviewPagination}
            onPageChange={handleReviewPageChange}
            loading={reviewsLoading}
          />
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;

// Made with Bob
