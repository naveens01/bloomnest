import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gift, Truck, Percent, Star, Clock, Zap, Leaf, Recycle, Heart, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { promotionApi, BackendPromotion } from '../services/api';

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Gift,
  Truck,
  Percent,
  Star,
  Clock,
  Zap,
};

const ecoIconMap: { [key: string]: React.ComponentType<any> } = {
  Leaf,
  Recycle,
  Heart,
  Sparkles,
};

const PromotionBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [promotions, setPromotions] = useState<BackendPromotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const response = await promotionApi.getAll({ type: 'banner' });
        if (response.data?.promotions && response.data.promotions.length > 0) {
          setPromotions(response.data.promotions);
        } else {
          // Fallback to default promotions if none in database
          setPromotions([
            {
              _id: '1',
              title: "ECO MEGA SALE",
              subtitle: "Up to 70% OFF",
              description: "On all eco-friendly home products",
              bgColor: "bg-eco-gradient",
              textColor: "text-eco-900",
              icon: "Percent",
              image: { url: "https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=800" },
              badge: "LIMITED TIME",
              cta: { text: "Shop Now" },
              ecoIcon: "Leaf",
              type: "banner",
              isActive: true,
              isFeatured: false,
            },
            {
              _id: '2',
              title: "FREE SHIPPING",
              subtitle: "No Minimum Order",
              description: "Free delivery on all sustainable products",
              bgColor: "bg-ocean-gradient",
              textColor: "text-ocean-900",
              icon: "Truck",
              image: { url: "https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=800" },
              badge: "TODAY ONLY",
              cta: { text: "Order Now" },
              ecoIcon: "Recycle",
              type: "banner",
              isActive: true,
              isFeatured: false,
            }
          ] as any);
        }
      } catch (error) {
        console.error('Failed to load promotions:', error);
        // Fallback to default promotions
        setPromotions([
          {
            _id: '1',
            title: "ECO MEGA SALE",
            subtitle: "Up to 70% OFF",
            description: "On all eco-friendly home products",
            bgColor: "bg-eco-gradient",
            textColor: "text-eco-900",
            icon: "Percent",
            image: { url: "https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=800" },
            badge: "LIMITED TIME",
            cta: { text: "Shop Now" },
            ecoIcon: "Leaf",
            type: "banner",
            isActive: true,
            isFeatured: false,
          },
          {
            _id: '2',
            title: "FREE SHIPPING",
            subtitle: "No Minimum Order",
            description: "Free delivery on all sustainable products",
            bgColor: "bg-ocean-gradient",
            textColor: "text-ocean-900",
            icon: "Truck",
            image: { url: "https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=800" },
            badge: "TODAY ONLY",
            cta: { text: "Order Now" },
            ecoIcon: "Recycle",
            type: "banner",
            isActive: true,
            isFeatured: false,
          }
        ] as any);
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (promotions.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [promotions.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-eco-pattern">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-eco-600 animate-spin" />
        </div>
      </section>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-eco-pattern">
      <div className="max-w-7xl mx-auto">
        <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-eco-glow-lg">
          {/* Slides */}
          <div 
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {promotions.map((promo: any) => {
              const IconComponent = typeof promo.icon === 'string' ? (iconMap[promo.icon] || Gift) : (promo.icon || Gift);
              const EcoIconComponent = typeof promo.ecoIcon === 'string' ? (ecoIconMap[promo.ecoIcon] || Leaf) : (promo.ecoIcon || Leaf);
              const promoImage = promo.image?.url || promo.image || "https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=800";
              return (
                <div
                  key={promo._id || promo.id}
                  className={`min-w-full h-full ${promo.bgColor || 'bg-eco-gradient'} relative overflow-hidden`}
                >
                  {/* Enhanced Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-64 sm:w-80 md:w-96 lg:w-[500px] h-64 sm:h-80 md:h-96 lg:h-[500px] bg-white rounded-full -translate-y-32 sm:-translate-y-40 md:-translate-y-48 lg:-translate-y-60 translate-x-32 sm:translate-x-40 md:translate-x-48 lg:translate-x-60 animate-blob"></div>
                    <div className="absolute bottom-0 left-0 w-48 sm:w-64 md:w-80 lg:w-80 h-48 sm:h-64 md:h-80 lg:h-80 bg-white rounded-full translate-y-24 sm:translate-y-32 md:translate-y-40 lg:translate-y-40 -translate-x-24 sm:-translate-x-32 md:-translate-x-40 lg:-translate-x-40 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 w-40 sm:w-48 md:w-56 lg:w-64 h-40 sm:h-48 md:h-56 lg:h-64 bg-white rounded-full -translate-x-20 sm:-translate-x-24 md:-translate-x-28 lg:-translate-x-32 -translate-y-20 sm:-translate-y-24 md:-translate-y-28 lg:-translate-y-32 animate-blob animation-delay-4000"></div>
                  </div>

                  <div className="relative z-10 h-full flex items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 w-full px-4 sm:px-6 md:px-8 lg:px-20">
                      {/* Content */}
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-4 sm:mb-6">
                          <div className="bg-glass p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                            <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                          </div>
                          {promo.badge && (
                            <div className="bg-glass-eco px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full border border-eco-200">
                              <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-eco-700">
                                {promo.badge}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-4">
                          <EcoIconComponent className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white/90" />
                          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold ${promo.textColor || 'text-eco-900'}`}>
                            {promo.title}
                          </h2>
                        </div>
                        
                        {promo.subtitle && (
                          <h3 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-3 sm:mb-4 md:mb-6 ${promo.textColor || 'text-eco-900'} text-opacity-90`}>
                            {promo.subtitle}
                          </h3>
                        )}
                        
                        {promo.description && (
                          <p className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 md:mb-10 ${promo.textColor || 'text-eco-900'} text-opacity-80 leading-relaxed max-w-lg`}>
                            {promo.description}
                          </p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <button className="bg-white text-nature-900 px-6 sm:px-8 md:px-10 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-eco-50 transition-all transform hover:scale-105 shadow-eco-glow hover:shadow-eco-glow-lg group">
                            <span className="flex items-center space-x-2">
                              <span>{promo.cta?.text || promo.cta || 'Shop Now'}</span>
                              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </button>
                          <button className="border-2 border-white text-white px-6 sm:px-8 md:px-10 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base md:text-lg hover:bg-white hover:text-nature-900 transition-all duration-300 hover:shadow-eco-glow">
                            Learn More
                          </button>
                        </div>
                      </div>

                      {/* Enhanced Image */}
                      {promoImage && (
                        <div className="hidden lg:flex items-center justify-center">
                          <div className="relative group">
                            <img
                              src={promoImage}
                              alt={promo.title}
                              className="w-64 sm:w-72 md:w-80 lg:w-96 h-48 sm:h-56 md:h-64 lg:h-80 object-cover rounded-2xl sm:rounded-3xl shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500 border-4 border-white"
                              loading="lazy"
                            />
                          <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-gradient-to-r from-earth-400 to-earth-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-eco-glow animate-pulse">
                            <div className="flex items-center space-x-2">
                              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>ECO DEAL!</span>
                            </div>
                          </div>
                          
                          {/* Floating eco badge */}
                          <div className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 bg-glass-eco p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-eco-200 shadow-eco-glow">
                            <div className="flex items-center space-x-2">
                              <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
                              <span className="text-xs font-semibold text-eco-700">100% Natural</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 bg-glass hover:bg-eco-100 text-eco-700 p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl transition-all backdrop-blur-sm hover:shadow-eco-glow border border-eco-200"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 bg-glass hover:bg-eco-100 text-eco-700 p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl transition-all backdrop-blur-sm hover:shadow-eco-glow border border-eco-200"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </button>

          {/* Enhanced Dots Indicator */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-125 shadow-eco-glow'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75 hover:scale-110'
                }`}
              />
            ))}
          </div>

          {/* Enhanced Timer Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 sm:h-2 bg-white bg-opacity-20">
            <div 
              className="h-full bg-gradient-to-r from-eco-400 to-eco-600 transition-all duration-4000 ease-linear rounded-r-full"
              style={{ 
                width: `${((currentSlide + 1) / promotions.length) * 100}%`,
                animation: 'progress 4s linear infinite'
              }}
            />
          </div>
        </div>

        {/* Enhanced Quick Action Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 md:mt-12">
          <div className="card-eco text-center hover:shadow-eco-glow transition-all duration-300 cursor-pointer group">
            <div className="bg-eco-gradient w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <Truck className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
            </div>
            <p className="font-bold text-eco-800 text-sm sm:text-base md:text-lg">Free Shipping</p>
            <p className="text-xs sm:text-sm text-eco-600">Orders $50+</p>
          </div>
          
          <div className="card-nature text-center hover:shadow-nature-glow transition-all duration-300 cursor-pointer group">
            <div className="bg-nature-gradient w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <Gift className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
            </div>
            <p className="font-bold text-nature-800 text-sm sm:text-base md:text-lg">Bundle Deals</p>
            <p className="text-xs sm:text-sm text-nature-600">Save More</p>
          </div>
          
          <div className="card-eco text-center hover:shadow-eco-glow transition-all duration-300 cursor-pointer group">
            <div className="bg-eco-gradient w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <Star className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
            </div>
            <p className="font-bold text-eco-800 text-sm sm:text-base md:text-lg">Top Rated</p>
            <p className="text-xs sm:text-sm text-eco-600">Best Products</p>
          </div>
          
          <div className="card-nature text-center hover:shadow-nature-glow transition-all duration-300 cursor-pointer group">
            <div className="bg-nature-gradient w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
            </div>
            <p className="font-bold text-nature-800 text-sm sm:text-base md:text-lg">Flash Sale</p>
            <p className="text-xs sm:text-sm text-nature-600">Limited Time</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default PromotionBanner;