const express = require('express');
const Settings = require('../models/Settings');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get public settings (no auth required)
// @route   GET /api/settings/public
// @access  Public
router.get('/public', asyncHandler(async (req, res) => {
  const codEnabled = await Settings.getValue('cod_enabled', true);
  const minOrderForCod = await Settings.getValue('min_order_for_cod', 0);
  const maxOrderForCod = await Settings.getValue('max_order_for_cod', 50000);
  const codCharge = await Settings.getValue('cod_charge', 0);
  
  res.status(200).json({
    status: 'success',
    data: {
      payment: {
        codEnabled,
        minOrderForCod,
        maxOrderForCod,
        codCharge
      }
    }
  });
}));

// @desc    Check if COD is available for order amount
// @route   GET /api/settings/cod-available/:amount
// @access  Public
router.get('/cod-available/:amount', asyncHandler(async (req, res) => {
  const amount = parseFloat(req.params.amount);
  
  const codEnabled = await Settings.getValue('cod_enabled', true);
  const minOrderForCod = await Settings.getValue('min_order_for_cod', 0);
  const maxOrderForCod = await Settings.getValue('max_order_for_cod', 50000);
  
  let available = codEnabled;
  let reason = '';
  
  if (!codEnabled) {
    reason = 'Cash on Delivery is currently not available';
  } else if (minOrderForCod > 0 && amount < minOrderForCod) {
    available = false;
    reason = `Minimum order amount for COD is ₹${minOrderForCod}`;
  } else if (maxOrderForCod > 0 && amount > maxOrderForCod) {
    available = false;
    reason = `Maximum order amount for COD is ₹${maxOrderForCod}`;
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      available,
      reason
    }
  });
}));

module.exports = router;

// Made with Bob
