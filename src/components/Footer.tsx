import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowUp, Heart, Sparkles, Globe, Users, Award } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-eco-900 via-eco-800 to-nature-900 text-white overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-eco-700/20 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-nature-700/20 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-ocean-700/20 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-10 right-10 animate-nature-float">
          <div className="w-8 h-8 bg-eco-600/30 rounded-full flex items-center justify-center opacity-80 animate-pulse">
            <Leaf className="h-4 w-4 text-eco-300" />
          </div>
        </div>
        <div className="absolute bottom-10 left-10 animate-nature-float animation-delay-2000">
          <div className="w-6 h-6 bg-nature-600/30 rounded-full flex items-center justify-center opacity-80 animate-ping">
            <Globe className="h-3 w-3 text-nature-300" />
          </div>
        </div>
        <div className="absolute top-1/3 left-1/4 animate-nature-float animation-delay-1000">
          <div className="w-4 h-4 bg-ocean-600/30 rounded-full flex items-center justify-center opacity-80 animate-pulse">
            <Sparkles className="h-2 w-2 text-ocean-300" />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Enhanced Company Info */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-eco-500 to-nature-500 rounded-2xl flex items-center justify-center shadow-eco-glow group-hover:shadow-eco-glow-lg transition-all duration-300 group-hover:scale-110 animate-pulse-slow">
                  <Leaf className="h-6 w-6 text-white animate-spin-slow" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-nature-400 rounded-full animate-ping"></div>
              </div>
              <span className="text-2xl font-bold text-gradient-eco group-hover:scale-105 transition-transform duration-300">
                BloomNest
              </span>
            </div>
            <p className="text-eco-200 leading-relaxed group-hover:text-eco-100 transition-colors duration-300">
              Leading the way in sustainable living with eco-friendly products that make a difference for our planet and future generations.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' }
              ].map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-eco-700/50 hover:bg-eco-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-eco-glow group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <social.icon className="h-5 w-5 text-eco-200 group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div className="space-y-6 animate-fade-in-up animation-delay-200">
            <h3 className="text-xl font-bold text-white mb-6 group">
              <span className="relative">
                Quick Links
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-eco-400 to-nature-400 group-hover:w-full transition-all duration-500 ease-out"></div>
              </span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Categories', path: '/categories' },
                { name: 'Brands', path: '/brands' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map((link, index) => (
                <li key={link.name} style={{ animationDelay: `${index * 100}ms` }}>
                  <Link
                    to={link.path}
                    className="text-eco-200 hover:text-white transition-colors duration-300 group flex items-center space-x-2 hover:translate-x-1 transform transition-transform duration-300"
                  >
                    <div className="w-1.5 h-1.5 bg-eco-400 rounded-full group-hover:bg-nature-400 transition-colors duration-300 animate-pulse"></div>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Categories */}
          <div className="space-y-6 animate-fade-in-up animation-delay-400">
            <h3 className="text-xl font-bold text-white mb-6 group">
              <span className="relative">
                Categories
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-eco-400 to-nature-400 group-hover:w-full transition-all duration-500 ease-out"></div>
              </span>
            </h3>
            <ul className="space-y-3">
              {[
                'Home & Living',
                'Personal Care',
                'Fashion',
                'Food & Beverages',
                'Electronics'
              ].map((category, index) => (
                <li key={category} style={{ animationDelay: `${index * 100}ms` }}>
                  <Link
                    to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-eco-200 hover:text-white transition-colors duration-300 group flex items-center space-x-2 hover:translate-x-1 transform transition-transform duration-300"
                  >
                    <div className="w-1.5 h-1.5 bg-nature-400 rounded-full group-hover:bg-ocean-400 transition-colors duration-300 animate-pulse"></div>
                    <span>{category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Contact Info */}
          <div className="space-y-6 animate-fade-in-up animation-delay-600">
            <h3 className="text-xl font-bold text-white mb-6 group">
              <span className="relative">
                Contact Us
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-eco-400 to-nature-400 group-hover:w-full transition-all duration-500 ease-out"></div>
              </span>
            </h3>
            <div className="space-y-4">
              {[
                { icon: Mail, text: 'hello@bloomnest.com', href: 'mailto:hello@bloomnest.com' },
                { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
                { icon: MapPin, text: '123 Eco Street, Green City, GC 12345', href: '#' }
              ].map((contact, index) => (
                <a
                  key={contact.text}
                  href={contact.href}
                  className="flex items-center space-x-3 text-eco-200 hover:text-white transition-colors duration-300 group hover:translate-x-1 transform transition-transform duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-8 h-8 bg-eco-700/50 hover:bg-eco-600 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-eco-glow">
                    <contact.icon className="h-4 w-4 text-eco-300 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-sm">{contact.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="border-t border-eco-700 mt-12 sm:mt-16 pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 text-eco-300 group">
              <span className="text-sm">Made with</span>
              <Heart className="h-4 w-4 text-red-400 animate-pulse group-hover:scale-125 transition-transform duration-300" />
              <span className="text-sm">for a sustainable future</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-eco-300 group">
                <Users className="h-4 w-4 animate-pulse-slow" />
                <span className="text-sm">10K+ Happy Customers</span>
              </div>
              <div className="flex items-center space-x-2 text-eco-300 group">
                <Award className="h-4 w-4 animate-pulse-slow" />
                <span className="text-sm">100% Eco-Friendly</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-eco-400 text-sm">
              © 2024 BloomNest. All rights reserved. Building a greener tomorrow, one product at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-eco-500 to-nature-500 text-white rounded-2xl shadow-eco-glow hover:shadow-eco-glow-lg transition-all duration-300 hover:scale-110 group z-50 animate-bounce-slow"
      >
        <ArrowUp className="h-6 w-6 mx-auto group-hover:-translate-y-1 transition-transform duration-300" />
        {/* Floating particles */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-white rounded-full animate-ping animation-delay-1000"></div>
        </div>
      </button>
    </footer>
  );
};

export default Footer;