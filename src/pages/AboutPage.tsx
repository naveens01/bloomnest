import React from 'react';
import { Leaf, Sparkles, Users, Award, Globe, Heart, ArrowRight, Star, Shield, Zap, Recycle, TreePine } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-eco-pattern">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-48 sm:w-96 h-48 sm:h-96 bg-eco-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
          <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-48 sm:w-96 h-48 sm:h-96 bg-ocean-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute top-20 sm:top-40 left-20 sm:left-40 w-48 sm:w-96 h-48 sm:h-96 bg-forest-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-glass-eco px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-eco-200 mb-6 sm:mb-8">
              <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
              <span className="text-xs sm:text-sm font-semibold text-eco-700">About Us</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gradient-eco mb-6 sm:mb-8">
              Building a Sustainable Future
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-eco-700 max-w-4xl mx-auto leading-relaxed px-4 mb-8 sm:mb-12">
              We're passionate about making eco-friendly living accessible, affordable, and beautiful. 
              Our mission is to connect conscious consumers with products that respect our planet.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="bg-glass-eco p-4 sm:p-6 rounded-2xl border border-eco-200">
                <div className="text-2xl sm:text-3xl font-bold text-eco-600 mb-1">10K+</div>
                <div className="text-xs sm:text-sm text-eco-700">Happy Customers</div>
              </div>
              <div className="bg-glass-eco p-4 sm:p-6 rounded-2xl border border-eco-200">
                <div className="text-2xl sm:text-3xl font-bold text-eco-600 mb-1">500+</div>
                <div className="text-xs sm:text-sm text-eco-700">Eco Products</div>
              </div>
              <div className="bg-glass-eco p-4 sm:p-6 rounded-2xl border border-eco-200">
                <div className="text-2xl sm:text-3xl font-bold text-eco-600 mb-1">100%</div>
                <div className="text-xs sm:text-sm text-eco-700">Sustainable</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-eco mb-4 sm:mb-6">
              Our Core Values
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-eco-600 max-w-3xl mx-auto px-4">
              These principles guide everything we do, from product selection to customer service
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-glass-eco p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-eco-200 text-center group hover:shadow-eco-glow transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-eco-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Leaf className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-eco-800 mb-3 sm:mb-4">Environmental Stewardship</h3>
              <p className="text-eco-600 text-sm sm:text-base">
                We prioritize products that minimize environmental impact and promote sustainable practices.
              </p>
            </div>
            
            <div className="bg-glass-eco p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-eco-200 text-center group hover:shadow-eco-glow transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-nature-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-eco-800 mb-3 sm:mb-4">Customer Care</h3>
              <p className="text-eco-600 text-sm sm:text-base">
                Your satisfaction and eco-journey matter to us. We're here to support your sustainable lifestyle.
              </p>
            </div>
            
            <div className="bg-glass-eco p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-eco-200 text-center group hover:shadow-eco-glow transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-ocean-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-eco-800 mb-3 sm:mb-4">Quality Assurance</h3>
              <p className="text-eco-600 text-sm sm:text-base">
                Every product is carefully vetted for quality, sustainability, and ethical production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-eco-800 to-eco-900 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-eco-glow-lg relative overflow-hidden">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10">
              <div>
                <div className="inline-flex items-center space-x-2 bg-white/90 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white mb-6 sm:mb-8">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-eco-700" />
                  <span className="text-xs sm:text-sm font-semibold text-eco-700">Our Mission</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 drop-shadow-2xl">
                  Join Our Mission
                </h2>
                
                <p className="text-base sm:text-lg lg:text-xl text-white mb-6 sm:mb-8 leading-relaxed font-medium">
                  We believe that every purchase can be a vote for a better planet. By choosing eco-friendly products, 
                  you're supporting sustainable practices and helping to create a healthier future for generations to come.
                </p>
                
                <p className="text-base sm:text-lg lg:text-xl text-white font-semibold mb-8">
                  Start your sustainable living journey today with our curated selection of eco-friendly products.
                </p>
                
                <button className="btn-eco px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-white text-eco-700 hover:bg-eco-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <span>Explore Products</span>
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2" />
                </button>
              </div>
              
              <div className="relative">
                <div className="w-full h-64 sm:h-80 lg:h-96 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <TreePine className="h-32 w-32 sm:h-40 sm:w-40 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-eco mb-4 sm:mb-6">
              Meet Our Team
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-eco-600 max-w-3xl mx-auto px-4">
              Passionate individuals dedicated to making sustainable living accessible to everyone
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-glass-eco p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-eco-200 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-eco-gradient rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-eco-800 mb-2">Sarah Johnson</h3>
              <p className="text-eco-600 text-sm mb-3">Founder & CEO</p>
              <p className="text-eco-600 text-xs sm:text-sm">
                Environmental scientist with 15+ years experience in sustainable business
              </p>
            </div>
            
            <div className="bg-glass-eco p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-eco-200 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-nature-gradient rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-eco-800 mb-2">Michael Chen</h3>
              <p className="text-eco-600 text-sm mb-3">Head of Product</p>
              <p className="text-eco-600 text-xs sm:text-sm">
                Former product manager at leading sustainable brands
              </p>
            </div>
            
            <div className="bg-glass-eco p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-eco-200 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-ocean-gradient rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Recycle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-eco-800 mb-2">Emma Rodriguez</h3>
              <p className="text-eco-600 text-sm mb-3">Sustainability Director</p>
              <p className="text-eco-600 text-xs sm:text-sm">
                Expert in circular economy and sustainable supply chains
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-glass-eco rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-eco-200">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-eco mb-6 sm:mb-8">
              Ready to Make a Difference?
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-eco-700 mb-8 sm:mb-12 px-4">
              Join thousands of eco-conscious consumers who are already making sustainable choices. 
              Every product you choose helps protect our planet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-eco px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold">
                <span>Start Shopping</span>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2" />
              </button>
              
              <button className="btn-eco px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 border-eco-200 text-eco-600 hover:bg-eco-50">
                <span>Learn More</span>
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;