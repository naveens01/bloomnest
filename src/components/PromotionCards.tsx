import React from 'react';
import { ArrowRight, Gift, Truck, Leaf, Percent, Sparkles, Star } from 'lucide-react';

const PromotionCards: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-nature-pattern">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-glass-nature px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-nature-200 mb-4 sm:mb-6">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-nature-600" />
            <span className="text-xs sm:text-sm font-semibold text-nature-700">Limited Time Offers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-nature mb-4 sm:mb-6">
            Special Offers
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-nature-600 max-w-3xl mx-auto leading-relaxed px-2">
            Don't miss out on these amazing deals for eco-friendly products.
            Sustainable shopping has never been more rewarding!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Free Shipping Promotion */}
          <div className="card-eco rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-eco-800 overflow-hidden group hover:shadow-eco-glow-lg transition-all duration-500 border border-eco-200 relative">
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-eco-200 rounded-full -translate-y-20 translate-x-20 opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-eco-100 rounded-full translate-y-16 -translate-x-16 opacity-20 animate-blob animation-delay-2000"></div>
            
            <div className="relative z-10">
              <div className="bg-eco-gradient w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-eco-glow group-hover:scale-110 transition-transform duration-300">
                <Truck className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <Leaf className="h-3 w-3 sm:h-4 sm:w-4 text-eco-600" />
                <span className="text-xs sm:text-sm font-semibold text-eco-700 bg-eco-50 px-2 py-1 sm:px-3 rounded-full">
                  Eco-Friendly
                </span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-eco-900">Free Shipping</h3>
              <p className="text-sm sm:text-base text-eco-700 mb-4 sm:mb-6 leading-relaxed">
                Get free shipping on all orders above $50. No minimum quantity required!
              </p>
              
              <button className="btn-eco px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold flex items-center space-x-2 group-hover:scale-105 hover:shadow-eco-glow-lg">
                <span>Shop Now</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Discount Promotion */}
          <div className="card-nature rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-nature-800 overflow-hidden group hover:shadow-nature-glow-lg transition-all duration-500 border border-nature-200 relative">
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-nature-200 rounded-full -translate-y-20 translate-x-20 opacity-20 animate-blob animation-delay-1000"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-nature-100 rounded-full translate-y-16 -translate-x-16 opacity-20 animate-blob animation-delay-3000"></div>
            
            <div className="relative z-10">
              <div className="bg-nature-gradient w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-nature-glow group-hover:scale-110 transition-transform duration-300">
                <Percent className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-nature-600" />
                <span className="text-xs sm:text-sm font-semibold text-nature-700 bg-nature-50 px-2 py-1 sm:px-3 rounded-full">
                  Special Deal
                </span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-nature-900">Up to 40% OFF</h3>
              <p className="text-sm sm:text-base text-nature-700 mb-4 sm:mb-6 leading-relaxed">
                Save big on selected eco-friendly products. Limited time offer, don't miss out!
              </p>
              
              <button className="btn-nature px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold flex items-center space-x-2 group-hover:scale-105 hover:shadow-nature-glow-lg">
                <span>View Deals</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Bundle Promotion */}
          <div className="card-eco rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-eco-800 overflow-hidden group hover:shadow-eco-glow-lg transition-all duration-500 border border-eco-200 relative">
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-eco-200 rounded-full -translate-y-20 translate-x-20 opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-eco-100 rounded-full translate-y-16 -translate-x-16 opacity-20 animate-blob animation-delay-4000"></div>
            
            <div className="relative z-10">
              <div className="bg-eco-gradient w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-eco-glow group-hover:scale-110 transition-transform duration-300">
                <Gift className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <Leaf className="h-3 w-3 sm:h-4 sm:w-4 text-eco-600" />
                <span className="text-xs sm:text-sm font-semibold text-eco-700 bg-eco-50 px-2 py-1 sm:px-3 rounded-full">
                  Bundle Deal
                </span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-eco-900">Buy 2 Get 1 FREE</h3>
              <p className="text-sm sm:text-base text-eco-700 mb-4 sm:mb-6 leading-relaxed">
                Mix and match personal care products. Perfect for gifting or personal use!
              </p>
              
              <button className="btn-eco px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold flex items-center space-x-2 group-hover:scale-105 hover:shadow-eco-glow-lg">
                <span>Shop Bundles</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionCards;