const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Category description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  ancestors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  level: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    url: String,
    alt: String
  },
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true,
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color']
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
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [String]
  },
  attributes: [{
    name: String,
    type: {
      type: String,
      enum: ['text', 'number', 'boolean', 'select', 'multiselect'],
      default: 'text'
    },
    required: Boolean,
    options: [String],
    unit: String,
    minValue: Number,
    maxValue: Number,
    defaultValue: mongoose.Schema.Types.Mixed
  }],
  filters: [{
    name: String,
    type: {
      type: String,
      enum: ['range', 'checkbox', 'radio', 'select'],
      default: 'checkbox'
    },
    options: [String],
    minValue: Number,
    maxValue: Number,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for product count
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Virtual for active product count
categorySchema.virtual('activeProductCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
  match: { isActive: true, status: 'published' }
});

// Virtual for full path
categorySchema.virtual('fullPath').get(function() {
  if (this.ancestors && this.ancestors.length > 0) {
    return [...this.ancestors, this._id];
  }
  return [this._id];
});

// Indexes for better query performance
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ ancestors: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ sortOrder: 1 });

// Generate slug before validation to satisfy required validator
categorySchema.pre('validate', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Pre-save middleware to update ancestors when parent changes
categorySchema.pre('save', async function(next) {
  if (this.isModified('parent')) {
    if (this.parent) {
      const parent = await this.constructor.findById(this.parent);
      if (parent) {
        this.level = parent.level + 1;
        this.ancestors = [...parent.ancestors, parent._id];
      }
    } else {
      this.level = 0;
      this.ancestors = [];
    }
  }
  next();
});

// Pre-save middleware to update subcategories when parent changes
categorySchema.pre('save', async function(next) {
  if (this.isModified('ancestors') || this.isModified('level')) {
    // Update all subcategories
    const subcategories = await this.constructor.find({ parent: this._id });
    for (const subcategory of subcategories) {
      subcategory.ancestors = [...this.ancestors, this._id];
      subcategory.level = this.level + 1;
      await subcategory.save();
    }
  }
  next();
});

// Static method to find root categories
categorySchema.statics.findRoots = function() {
  return this.find({ parent: null, isActive: true }).sort('sortOrder');
};

// Static method to find categories by level
categorySchema.statics.findByLevel = function(level) {
  return this.find({ level, isActive: true }).sort('sortOrder');
};

// Static method to find featured categories
categorySchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, isActive: true }).sort('sortOrder');
};

// Static method to build category tree
categorySchema.statics.buildTree = function() {
  return this.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: 'parent',
        as: 'children'
      }
    },
    {
      $addFields: {
        hasChildren: { $gt: [{ $size: '$children' }, 0] }
      }
    },
    {
      $sort: { sortOrder: 1, name: 1 }
    }
  ]);
};

// Static method to find category path
categorySchema.statics.findPath = function(categoryId) {
  return this.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(categoryId) }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'ancestors',
        foreignField: '_id',
        as: 'ancestorDetails'
      }
    },
    {
      $addFields: {
        path: {
          $concatArrays: ['$ancestorDetails', [{
            _id: '$_id',
            name: '$name',
            slug: '$slug',
            level: '$level'
          }]]
        }
      }
    },
    {
      $project: {
        path: 1
      }
    }
  ]);
};

module.exports = mongoose.model('Category', categorySchema);
