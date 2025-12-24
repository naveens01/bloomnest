const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Promotion title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['banner', 'card'],
    required: true,
    default: 'card'
  },
  image: {
    url: {
      type: String,
      trim: true
    },
    alt: {
      type: String,
      trim: true
    }
  },
  icon: {
    type: String,
    trim: true,
    default: 'Gift'
  },
  ecoIcon: {
    type: String,
    trim: true,
    default: 'Leaf'
  },
  badge: {
    type: String,
    trim: true,
    maxlength: [50, 'Badge text cannot exceed 50 characters']
  },
  cta: {
    text: {
      type: String,
      trim: true,
      default: 'Shop Now'
    },
    link: {
      type: String,
      trim: true
    }
  },
  bgColor: {
    type: String,
    trim: true,
    default: 'bg-eco-gradient'
  },
  textColor: {
    type: String,
    trim: true,
    default: 'text-eco-900'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
promotionSchema.index({ type: 1, isActive: 1 });
promotionSchema.index({ isFeatured: 1, isActive: 1 });
promotionSchema.index({ displayOrder: 1 });

// Virtual for isExpired
promotionSchema.virtual('isExpired').get(function() {
  if (!this.endDate) return false;
  return new Date() > this.endDate;
});

// Virtual for isActiveNow
promotionSchema.virtual('isActiveNow').get(function() {
  if (!this.isActive) return false;
  const now = new Date();
  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;
  return true;
});

module.exports = mongoose.model('Promotion', promotionSchema);


