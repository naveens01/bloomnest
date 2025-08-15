import React from 'react';
import { ArrowRight, Leaf, Recycle, Heart, Sparkles, Star, Globe, Zap, Award, Users, TrendingUp, Shield } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-eco-gradient py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-eco-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-ocean-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-earth-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
        
        {/* Additional floating background elements */}
        <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-nature-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-1000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-forest-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-3000"></div>
        
        {/* Enhanced Floating eco elements */}
        <div className="absolute top-20 right-20 animate-nature-float">
          <div className="w-16 h-16 bg-eco-100 rounded-full flex items-center justify-center opacity-80 animate-pulse">
            <Leaf className="h-8 w-8 text-eco-600" />
          </div>
        </div>
        <div className="absolute bottom-20 left-20 animate-nature-float animation-delay-2000">
          <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center opacity-80 animate-bounce-slow">
            <Recycle className="h-6 w-6 text-ocean-600" />
          </div>
        </div>
        
        {/* Additional floating decorative elements */}
        <div className="absolute top-1/3 left-10 animate-nature-float animation-delay-1000">
          <div className="w-8 h-8 bg-nature-100 rounded-full flex items-center justify-center opacity-80 animate-ping">
            <Sparkles className="h-4 w-4 text-nature-600" />
          </div>
        </div>
        <div className="absolute top-2/3 right-1/4 animate-nature-float animation-delay-3000">
          <div className="w-6 h-6 bg-forest-100 rounded-full flex items-center justify-center opacity-80 animate-pulse">
            <Star className="h-3 w-3 text-forest-600" />
          </div>
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-nature-float animation-delay-1500">
          <div className="w-10 h-10 bg-earth-100 rounded-full flex items-center justify-center opacity-80 animate-pulse-slow">
            <Globe className="h-5 w-5 text-earth-600" />
          </div>
        </div>
        <div className="absolute top-1/2 right-1/3 animate-nature-float animation-delay-2500">
          <div className="w-7 h-7 bg-ocean-100 rounded-full flex items-center justify-center opacity-80 animate-ping">
            <Zap className="h-4 w-4 text-ocean-600" />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 relative z-10">
            <div className="space-y-6">
              {/* Enhanced Badge with more animations */}
              <div className="inline-flex items-center space-x-2 bg-glass-eco px-4 py-2 rounded-full border border-eco-200 animate-fade-in-up hover:scale-105 transition-transform duration-300 group">
                <Sparkles className="h-4 w-4 text-eco-600 animate-pulse" />
                <span className="text-sm font-medium text-eco-700">100% Sustainable & Natural</span>
                <div className="w-2 h-2 bg-nature-400 rounded-full animate-ping"></div>
              </div>
              
              {/* Enhanced Main Heading with more animations */}
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in-up">
                  <span className="text-nature-900 block group-hover:scale-105 transition-transform duration-300">Shop</span>
                  <span className="text-gradient-eco block group-hover:scale-105 transition-transform duration-300">Eco-Friendly</span>
                  <span className="text-nature-900 block group-hover:scale-105 transition-transform duration-300">Products</span>
                </h1>
                
                {/* Enhanced subtitle with better visual appeal */}
                <div className="relative">
                  <span className="text-nature-700 text-3xl sm:text-4xl lg:text-5xl font-semibold block group-hover:scale-105 transition-transform duration-300 animate-fade-in-up animation-delay-300">
                    for a Better Tomorrow
                  </span>
                  {/* Decorative underline */}
                  <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-eco-400 to-nature-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-32"></div>
                </div>
                
                {/* Enhanced visual indicator */}
                <div className="flex items-center space-x-3 pt-2 animate-fade-in-up animation-delay-400">
                  <div className="w-2 h-2 bg-gradient-to-r from-eco-500 to-nature-500 rounded-full animate-pulse"></div>
                  <span className="text-nature-600 text-sm sm:text-base font-medium">Sustainable • Natural • Ethical</span>
                  <div className="w-2 h-2 bg-gradient-to-r from-nature-500 to-ocean-500 rounded-full animate-pulse animation-delay-1000"></div>
                </div>
              </div>
              
              {/* Enhanced Description with animation */}
              <p className="text-xl lg:text-2xl text-nature-600 leading-relaxed animate-fade-in-up animation-delay-200 max-w-2xl group-hover:text-nature-700 transition-colors duration-300">
                Discover sustainable products from trusted brands that care about our planet. Make every purchase count towards a greener future.
              </p>
            </div>

            {/* Enhanced CTA Buttons with more animations */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
              <button className="btn-eco px-10 py-4 text-lg font-semibold flex items-center justify-center space-x-3 group hover:scale-105 transition-all duration-300 animate-pulse-slow">
                <span>Shop Now</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300 animate-bounce-slow" />
                {/* Enhanced button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-eco-400/20 to-nature-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"></div>
              </button>
              
              <button className="border-2 border-eco-500 text-eco-600 hover:bg-eco-500 hover:text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-eco-glow group">
                <span className="flex items-center space-x-2">
                  <span>Learn More</span>
                  <Leaf className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </button>
            </div>

            {/* Enhanced Feature Cards with more animations */}
            <div className="grid grid-cols-3 gap-8 pt-10 animate-fade-in-up animation-delay-600">
              <div className="text-center group cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="bg-eco-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-eco-200 group-hover:shadow-eco-glow relative">
                  <Leaf className="h-8 w-8 text-eco-600 group-hover:animate-bounce" />
                  {/* Floating particle */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-nature-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <p className="text-sm font-semibold text-nature-700 group-hover:text-eco-600 transition-colors duration-300">100% Natural</p>
              </div>
              <div className="text-center group cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="bg-ocean-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-ocean-200 group-hover:shadow-ocean-glow relative">
                  <Recycle className="h-8 w-8 text-ocean-600 group-hover:animate-spin" />
                  {/* Floating particle */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-ocean-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <p className="text-sm font-semibold text-nature-700 group-hover:text-ocean-600 transition-colors duration-300">Sustainable</p>
              </div>
              <div className="text-center group cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="bg-earth-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-earth-200 group-hover:shadow-earth-glow relative">
                  <Heart className="h-8 w-8 text-earth-600 group-hover:animate-pulse" />
                  {/* Floating particle */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-earth-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <p className="text-sm font-semibold text-nature-700 group-hover:text-earth-600 transition-colors duration-300">Ethically Made</p>
              </div>
            </div>
            
            {/* Additional modern UI element - Trust indicators */}
            <div className="flex items-center space-x-6 pt-6 animate-fade-in-up animation-delay-800">
              <div className="flex items-center space-x-2 text-nature-600">
                <Shield className="h-5 w-5 text-eco-500 animate-pulse-slow" />
                <span className="text-sm font-medium">Trusted by 10K+</span>
              </div>
              <div className="flex items-center space-x-2 text-nature-600">
                <Award className="h-5 w-5 text-nature-500 animate-pulse-slow" />
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-right animation-delay-800">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/6957241/pexels-photo-6957241.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Eco-friendly products"
                className="w-full h-[500px] lg:h-[600px] object-cover rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border-4 border-white group-hover:border-eco-200"
              />
              
              {/* Enhanced floating stats card with more animations */}
              <div className="absolute -bottom-8 -left-8 bg-glass-eco p-8 rounded-2xl shadow-eco-glow hover:shadow-eco-glow-lg transition-all duration-300 animate-bounce-in animation-delay-1200 border border-eco-200 group hover:scale-105">
                <div className="flex items-center space-x-4">
                  <div className="bg-eco-100 p-3 rounded-xl animate-eco-pulse group-hover:animate-bounce">
                    <Leaf className="h-8 w-8 text-eco-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-eco-800 group-hover:scale-110 transition-transform duration-300">500+</p>
                    <p className="text-sm font-medium text-eco-700">Eco Products</p>
                  </div>
                </div>
                {/* Floating particles around stats card */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-nature-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-ocean-400 rounded-full animate-ping animation-delay-1000 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Enhanced additional floating element */}
              <div className="absolute -top-6 -right-6 bg-glass-nature p-4 rounded-2xl shadow-nature-glow animate-nature-float group hover:scale-110 transition-transform duration-300">
                <div className="text-center">
                  <div className="bg-nature-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:animate-pulse">
                    <Recycle className="h-6 w-6 text-nature-600" />
                  </div>
                  <p className="text-xs font-medium text-nature-700">Carbon Neutral</p>
                </div>
                {/* Enhanced glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-nature-400/20 to-ocean-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-lg"></div>
              </div>
              
              {/* Additional floating element - Customer satisfaction */}
              <div className="absolute top-1/4 -left-4 bg-glass-eco p-3 rounded-2xl shadow-eco-glow animate-nature-float animation-delay-1500 group hover:scale-110 transition-transform duration-300">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-eco-600 group-hover:animate-bounce" />
                  <span className="text-xs font-medium text-eco-700">98% Happy</span>
                </div>
              </div>
              
              {/* Additional floating element - Trending */}
              <div className="absolute bottom-1/4 -right-4 bg-glass-nature p-3 rounded-2xl shadow-nature-glow animate-nature-float animation-delay-2000 group hover:scale-110 transition-transform duration-300">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-nature-600 group-hover:animate-pulse" />
                  <span className="text-xs font-medium text-nature-700">Trending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;