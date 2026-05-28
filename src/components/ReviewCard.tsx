import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Review } from '../types';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, className = '' }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-4 sm:p-6 border border-eco-100 hover:shadow-lg transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-eco-800 text-sm sm:text-base">
              {review.userName}
            </h4>
            {review.isVerified && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                <CheckCircle className="h-3 w-3" />
                <span className="hidden sm:inline">Verified</span>
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {formatDate((review as any).customDate || review.createdAt)}
          </p>
        </div>
        
        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;

// Made with Bob
