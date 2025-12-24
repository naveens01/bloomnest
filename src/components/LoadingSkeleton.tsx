import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 animate-pulse">
      <div className="h-48 sm:h-64 bg-gray-200 rounded-t-xl sm:rounded-t-2xl"></div>
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export const BrandCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-white via-eco-50 to-nature-50 rounded-2xl sm:rounded-3xl shadow-eco-glow border border-eco-200 animate-pulse">
      <div className="h-48 sm:h-64 bg-gray-200 rounded-t-2xl sm:rounded-t-3xl"></div>
      <div className="p-4 sm:p-8 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="card-eco rounded-2xl sm:rounded-3xl shadow-eco border border-eco-200 animate-pulse">
      <div className="h-48 sm:h-64 bg-gray-200 rounded-t-2xl sm:rounded-t-3xl"></div>
      <div className="p-4 sm:p-8 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

export const PageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="h-12 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};


