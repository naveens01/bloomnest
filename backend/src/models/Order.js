const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative']
    },
    variant: {
      name: String,
      value: String,
      priceModifier: Number
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    amount: {
      type: Number,
      default: 0,
      min: [0, 'Tax amount cannot be negative']
    },
    rate: {
      type: Number,
      default: 0,
      min: [0, 'Tax rate cannot be negative']
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    }
  },
  shipping: {
    method: {
      type: String,
      required: true,
      enum: ['standard', 'express', 'overnight', 'pickup']
    },
    cost: {
      type: Number,
      required: true,
      min: [0, 'Shipping cost cannot be negative']
    },
    address: {
      type: {
        type: String,
        enum: ['home', 'work', 'other'],
        default: 'home'
      },
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'United States'
      }
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  discount: {
    code: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    value: {
      type: Number,
      default: 0,
      min: [0, 'Discount value cannot be negative']
    },
    amount: {
      type: Number,
      default: 0,
      min: [0, 'Discount amount cannot be negative']
    }
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      required: true,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'apple_pay', 'google_pay', 'bank_transfer', 'cash_on_delivery']
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    gateway: String,
    gatewayResponse: mongoose.Schema.Types.Mixed
  },
  notes: {
    customer: String,
    internal: String
  },
  tags: [String],
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  source: {
    type: String,
    enum: ['web', 'mobile', 'phone', 'in_store'],
    default: 'web'
  },
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for item count
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for is paid
orderSchema.virtual('isPaid').get(function() {
  return this.payment.status === 'completed';
});

// Virtual for is shipped
orderSchema.virtual('isShipped').get(function() {
  return ['shipped', 'delivered'].includes(this.status);
});

// Virtual for is delivered
orderSchema.virtual('isDelivered').get(function() {
  return this.status === 'delivered';
});

// Virtual for can cancel
orderSchema.virtual('canCancel').get(function() {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
});

// Virtual for can refund
orderSchema.virtual('canRefund').get(function() {
  return ['delivered', 'shipped'].includes(this.status) && this.payment.status === 'completed';
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'shipping.trackingNumber': 1 });

// Pre-save middleware to generate order number and calculate totals
orderSchema.pre('save', function(next) {
  // Generate order number if not provided
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `BN${timestamp.slice(-8)}${random}`;
  }
  
  // Calculate item totals
  this.items.forEach(item => {
    item.total = item.price * item.quantity;
  });
  
  // Calculate subtotal
  this.subtotal = this.items.reduce((total, item) => total + item.total, 0);
  
  // Calculate tax amount
  if (this.tax.type === 'percentage') {
    this.tax.amount = (this.subtotal * this.tax.rate) / 100;
  } else {
    this.tax.amount = this.tax.rate;
  }
  
  // Calculate discount amount
  if (this.discount.type === 'percentage') {
    this.discount.amount = (this.subtotal * this.discount.value) / 100;
  } else {
    this.discount.amount = this.discount.value;
  }
  
  // Calculate total
  this.total = this.subtotal + this.tax.amount + this.shipping.cost - this.discount.amount;
  
  // Update payment amount
  this.payment.amount = this.total;
  
  next();
});

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  if (notes) {
    this.notes.internal = notes;
  }
  this.updatedAt = new Date();
  return this.save();
};

// Method to add tracking
orderSchema.methods.addTracking = function(trackingNumber, estimatedDelivery) {
  this.shipping.trackingNumber = trackingNumber;
  if (estimatedDelivery) {
    this.shipping.estimatedDelivery = estimatedDelivery;
  }
  this.status = 'shipped';
  this.updatedAt = new Date();
  return this.save();
};

// Method to mark as delivered
orderSchema.methods.markDelivered = function() {
  this.status = 'delivered';
  this.shipping.actualDelivery = new Date();
  this.updatedAt = new Date();
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason = '') {
  if (!this.canCancel) {
    throw new Error('Order cannot be cancelled in current status');
  }
  
  this.status = 'cancelled';
  if (reason) {
    this.notes.internal = reason;
  }
  this.updatedAt = new Date();
  return this.save();
};

// Static method to find orders by user
orderSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to find recent orders
orderSchema.statics.findRecent = function(limit = 10) {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

// Static method to get order statistics
orderSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$total' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('Order', orderSchema);
