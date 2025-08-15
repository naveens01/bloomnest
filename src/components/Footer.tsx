import React from 'react';
import { Leaf, Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold">EcoMarket</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Your trusted marketplace for sustainable, eco-friendly products. Making green living accessible to everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-500 transition-colors">Home & Living</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Personal Care</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Fashion</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Food & Beverages</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Baby & Kids</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Health & Wellness</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Partner Brands</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 EcoMarket. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-green-500 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-green-500 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-green-500 text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;