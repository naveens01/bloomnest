const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Payment Settings
  codEnabled: {
    type: Boolean,
    default: true,
    description: 'Enable or disable Cash on Delivery (COD) payment method globally'
  },
  
  // Store Settings
  storeName: {
    type: String,
    default: 'BloomNest',
    trim: true
  },
  storeEmail: {
    type: String,
    default: 'support@bloomnest.com',
    trim: true,
    lowercase: true
  },
  storePhone: {
    type: String,
    default: '+91 1234567890',
    trim: true
  },
  
  // Shipping Settings
  freeShippingThreshold: {
    type: Number,
    default: 500,
    min: 0
  },
  standardShippingFee: {
    type: Number,
    default: 50,
    min: 0
  },
  
  // Order Settings
  minOrderAmount: {
    type: Number,
    default: 100,
    min: 0
  },
  maxOrderAmount: {
    type: Number,
    default: 50000,
    min: 0
  },
  
  // Feature Flags
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  allowGuestCheckout: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

settingsSchema.statics.updateSettings = async function(updates, userId) {
  let settings = await this.getSettings();
  Object.assign(settings, updates);
  settings.lastUpdatedBy = userId;
  await settings.save();
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;

// Made with Bob
