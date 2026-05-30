const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['payment', 'shipping', 'general', 'email', 'sms'],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
settingsSchema.index({ key: 1 });
settingsSchema.index({ category: 1 });

// Static method to get setting value
settingsSchema.statics.getValue = async function(key, defaultValue = null) {
  const setting = await this.findOne({ key, isActive: true });
  return setting ? setting.value : defaultValue;
};

// Static method to set setting value
settingsSchema.statics.setValue = async function(key, value, userId = null) {
  const setting = await this.findOneAndUpdate(
    { key },
    { 
      value, 
      updatedBy: userId,
      isActive: true 
    },
    { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true 
    }
  );
  return setting;
};

// Initialize default settings
settingsSchema.statics.initializeDefaults = async function() {
  const defaults = [
    {
      key: 'cod_enabled',
      value: true,
      description: 'Enable/Disable Cash on Delivery payment method',
      category: 'payment'
    },
    {
      key: 'min_order_for_cod',
      value: 0,
      description: 'Minimum order amount for COD (0 = no minimum)',
      category: 'payment'
    },
    {
      key: 'max_order_for_cod',
      value: 50000,
      description: 'Maximum order amount for COD (0 = no maximum)',
      category: 'payment'
    },
    {
      key: 'cod_charge',
      value: 0,
      description: 'Additional charge for COD orders',
      category: 'payment'
    }
  ];

  for (const setting of defaults) {
    await this.findOneAndUpdate(
      { key: setting.key },
      setting,
      { upsert: true, setDefaultsOnInsert: true }
    );
  }
};

module.exports = mongoose.model('Settings', settingsSchema);

// Made with Bob
