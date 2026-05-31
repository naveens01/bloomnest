const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Type of review: product, category, or brand
  reviewType: {
    type: String,
    required: true,
    enum: ['product', 'category', 'brand'],
    index: true
  },
  
  // Reference to the target item (product/category/brand)
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetModel',
    index: true
  },
  
  // Dynamic reference based on reviewType
  targetModel: {
    type: String,
    required: true,
    enum: ['Product', 'Category', 'Brand']
  },
  
  // Reviewer information
  userName: {
    type: String,
    required: true,
    trim: true
  },
  
  userEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  // Rating (1-5 stars)
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // Review comment
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  
  // Verification and approval
  isVerified: {
    type: Boolean,
    default: false
  },
  
  isApproved: {
    type: Boolean,
    default: true
  },
  
  // Admin who created this review
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Custom date for admin to control when review appears to be posted
  customDate: {
    type: Date,
    default: null
  },
  
  // Helpful votes (for future feature)
  helpfulCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
reviewSchema.index({ reviewType: 1, targetId: 1, createdAt: -1 });
reviewSchema.index({ isApproved: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

// Virtual for target reference
reviewSchema.virtual('target', {
  refPath: 'targetModel',
  localField: 'targetId',
  foreignField: '_id',
  justOne: true
});

// Method to get average rating for a target
reviewSchema.statics.getAverageRating = async function(reviewType, targetId) {
  const result = await this.aggregate([
    {
      $match: {
        reviewType,
        targetId: new mongoose.Types.ObjectId(targetId),
        isApproved: true
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  
  return result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
};

// Method to get rating distribution
reviewSchema.statics.getRatingDistribution = async function(reviewType, targetId) {
  const distribution = await this.aggregate([
    {
      $match: {
        reviewType,
        targetId: new mongoose.Types.ObjectId(targetId),
        isApproved: true
      }
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);
  
  // Format as object with all ratings
  const result = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  distribution.forEach(item => {
    result[item._id] = item.count;
  });
  
  return result;
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

// Made with Bob
