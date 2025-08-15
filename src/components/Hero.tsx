import React from 'react';
import { ArrowRight, Leaf, Recycle, Heart, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-eco-gradient py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-eco-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-ocean-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-earth-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
        
        {/* Floating eco elements */}
        <div className="absolute top-20 right-20 animate-nature-float">
          <div className="w-16 h-16 bg-eco-100 rounded-full flex items-center justify-center opacity-80">
            <Leaf className="h-8 w-8 text-eco-600" />
          </div>
        </div>
        <div className="absolute bottom-20 left-20 animate-nature-float animation-delay-2000">
          <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center opacity-80">
            <Recycle className="h-6 w-6 text-ocean-600" />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 relative z-10">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-glass-eco px-4 py-2 rounded-full border border-eco-200 animate-fade-in-up">
                <Sparkles className="h-4 w-4 text-eco-600" />
                <span className="text-sm font-medium text-eco-700">100% Sustainable & Natural</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in-up">
                <span className="text-nature-900">Shop </span>
                <span className="text-gradient-eco">Eco-Friendly</span>
                <span className="text-nature-900"> Products</span>
                <br />
                <span className="text-nature-700 text-4xl sm:text-5xl lg:text-6xl">for a Better Tomorrow</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-nature-600 leading-relaxed animate-fade-in-up animation-delay-200 max-w-2xl">
                Discover sustainable products from trusted brands that care about our planet. Make every purchase count towards a greener future.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
              <button className="btn-eco px-10 py-4 text-lg font-semibold flex items-center justify-center space-x-3 group">
                <span>Shop Now</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              <button className="border-2 border-eco-500 text-eco-600 hover:bg-eco-500 hover:text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-eco-glow">
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-10 animate-fade-in-up animation-delay-600">
              <div className="text-center group cursor-pointer">
                <div className="bg-eco-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-eco-200 group-hover:shadow-eco-glow">
                  <Leaf className="h-8 w-8 text-eco-600" />
                </div>
                <p className="text-sm font-semibold text-nature-700">100% Natural</p>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="bg-ocean-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-ocean-200 group-hover:shadow-ocean-glow">
                  <Recycle className="h-8 w-8 text-ocean-600" />
                </div>
                <p className="text-sm font-semibold text-nature-700">Sustainable</p>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="bg-earth-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-earth-200 group-hover:shadow-earth-glow">
                  <Heart className="h-8 w-8 text-earth-600" />
                </div>
                <p className="text-sm font-semibold text-nature-700">Ethically Made</p>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-right animation-delay-800">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/6957241/pexels-photo-6957241.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Eco-friendly products"
                className="w-full h-[500px] lg:h-[600px] object-cover rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border-4 border-white"
              />
              
              {/* Enhanced floating stats card */}
              <div className="absolute -bottom-8 -left-8 bg-glass-eco p-8 rounded-2xl shadow-eco-glow hover:shadow-eco-glow-lg transition-all duration-300 animate-bounce-in animation-delay-1200 border border-eco-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-eco-100 p-3 rounded-xl animate-eco-pulse">
                    <Leaf className="h-8 w-8 text-eco-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-eco-800">500+</p>
                    <p className="text-sm font-medium text-eco-700">Eco Products</p>
                  </div>
                </div>
              </div>
              
              {/* Additional floating element */}
              <div className="absolute -top-6 -right-6 bg-glass-nature p-4 rounded-2xl shadow-nature-glow animate-nature-float">
                <div className="text-center">
                  <div className="bg-nature-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Recycle className="h-6 w-6 text-nature-600" />
                  </div>
                  <p className="text-xs font-medium text-nature-700">Carbon Neutral</p>
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