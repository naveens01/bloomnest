const express = require('express');
const Settings = require('../models/Settings');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get public settings (COD status, shipping info, etc.)
// @route   GET /api/settings/public
// @access  Public
router.get('/public', asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();
  
  // Only return public-facing settings
  const publicSettings = {
    codEnabled: settings.codEnabled,
    freeShippingThreshold: settings.freeShippingThreshold,
    standardShippingFee: settings.standardShippingFee,
    minOrderAmount: settings.minOrderAmount,
    maxOrderAmount: settings.maxOrderAmount,
    storeName: settings.storeName,
    storeEmail: settings.storeEmail,
    storePhone: settings.storePhone,
    maintenanceMode: settings.maintenanceMode,
    allowGuestCheckout: settings.allowGuestCheckout
  };
  
  res.status(200).json({
    status: 'success',
    data: { settings: publicSettings }
  });
}));

module.exports = router;

// Made with Bob
