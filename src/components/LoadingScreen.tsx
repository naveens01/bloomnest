import React, { useState, useEffect } from 'react';
import { Globe, Leaf, Recycle, Sparkles, Zap } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading, onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowContent(true);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowContent(false);
              setTimeout(onLoadingComplete, 500);
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isLoading, onLoadingComplete]);

  if (!showContent) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-eco-900 via-eco-800 to-nature-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating eco elements */}
        <div className="absolute top-20 left-20 animate-float" style={{ animationDelay: '0s' }}>
          <Leaf className="h-16 w-16 text-eco-400/30" />
        </div>
        <div className="absolute top-40 right-32 animate-float" style={{ animationDelay: '2s' }}>
          <Recycle className="h-12 w-12 text-nature-400/30" />
        </div>
        <div className="absolute bottom-32 left-32 animate-float" style={{ animationDelay: '4s' }}>
          <Sparkles className="h-14 w-14 text-ocean-400/30" />
        </div>
        <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '6s' }}>
          <Zap className="h-10 w-10 text-forest-400/30" />
        </div>
        
        {/* Animated blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-eco-500/10 rounded-full animate-blob blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-nature-500/10 rounded-full animate-blob blur-3xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-ocean-500/10 rounded-full animate-blob blur-3xl" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        {/* Earth Globe Container */}
        <div className="relative mb-12">
          {/* Outer glow ring */}
          <div className="absolute inset-0 w-80 h-80 bg-gradient-to-r from-eco-400 via-nature-400 to-ocean-400 rounded-full blur-2xl animate-pulse opacity-50"></div>
          
          {/* Earth Globe */}
          <div className="relative w-64 h-64 bg-gradient-to-br from-ocean-400 via-eco-400 to-nature-400 rounded-full shadow-2xl animate-spin-slow">
            {/* Continents */}
            <div className="absolute inset-4 bg-gradient-to-br from-forest-600 via-earth-600 to-eco-600 rounded-full opacity-80"></div>
            
            {/* Ocean details */}
            <div className="absolute inset-6 bg-gradient-to-br from-ocean-500 via-ocean-400 to-ocean-300 rounded-full opacity-60"></div>
            
            {/* Land masses */}
            <div className="absolute top-8 left-12 w-16 h-8 bg-forest-700 rounded-full opacity-90"></div>
            <div className="absolute top-16 right-16 w-12 h-6 bg-earth-700 rounded-full opacity-90"></div>
            <div className="absolute bottom-20 left-20 w-14 h-10 bg-eco-700 rounded-full opacity-90"></div>
            <div className="absolute bottom-12 right-8 w-10 h-6 bg-nature-700 rounded-full opacity-90"></div>
            
            {/* Atmosphere glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-eco-300/20 via-transparent to-nature-300/20 rounded-full animate-pulse"></div>
          </div>
          
          {/* Orbiting elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-eco-400 rounded-full animate-ping"></div>
          </div>
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-nature-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="w-3 h-3 bg-ocean-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            <span className="text-gradient-eco">Eco</span>
            <span className="text-gradient-nature">World</span>
          </h1>
          <p className="text-xl text-eco-100 font-medium max-w-md mx-auto leading-relaxed">
            Loading your sustainable shopping experience...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 max-w-full mb-8">
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-eco-400 via-nature-400 to-ocean-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-3 text-eco-100 font-medium">
            {progress}% Complete
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-eco-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-nature-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-ocean-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Eco-friendly message */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
            <Leaf className="h-5 w-5 text-eco-300" />
            <span className="text-sm font-semibold text-white">
              Building a Greener Future Together
            </span>
          </div>
        </div>
      </div>

      {/* Bottom wave effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-eco-800/50 to-transparent"></div>
    </div>
  );
};

export default LoadingScreen;


