import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { Review, ReviewStats } from '../types';

interface ReviewSectionProps {
  reviews: Review[];
  stats: ReviewStats;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews,
  stats,
  pagination,
  onPageChange,
  loading = false,
}) => {
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.rating - a.rating;
    }
  });

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="bg-gradient-to-br from-eco-50 to-nature-50 rounded-2xl p-4 sm:p-6 border-2 border-eco-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-eco-800">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(stats.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-eco-600 mt-1">
                  Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] || 0;
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="text-eco-700 font-medium w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-eco-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-eco-800">
          Customer Reviews ({stats.totalReviews})
        </h3>
        
        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-eco-700 font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating')}
            className="px-3 py-2 border-2 border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent text-sm"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-600"></div>
        </div>
      ) : sortedReviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-md border border-eco-100">
          <p className="text-eco-600 text-lg">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-lg border-2 border-eco-200 hover:bg-eco-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-eco-700" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange?.(page)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  page === pagination.page
                    ? 'bg-eco-500 text-white'
                    : 'border-2 border-eco-200 text-eco-700 hover:bg-eco-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="p-2 rounded-lg border-2 border-eco-200 hover:bg-eco-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-eco-700" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;

// Made with Bob
