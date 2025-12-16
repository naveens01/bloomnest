const express = require('express');
const Promotion = require('../models/Promotion');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get all active promotions
// @route   GET /api/promotions
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { type } = req.query;
  
  const query = { isActive: true };
  if (type) {
    query.type = type;
  }

  // Check date ranges
  const now = new Date();
  query.$or = [
    { endDate: { $exists: false } },
    { endDate: { $gte: now } }
  ];

  if (query.$or.length > 0) {
    query.$and = [
      { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] }
    ];
  }

  const promotions = await Promotion.find(query)
    .sort({ displayOrder: 1, createdAt: -1 });

  res.status(200).json({
    status: 'success',
    data: { promotions }
  });
}));

// @desc    Get featured promotions
// @route   GET /api/promotions/featured
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const { type } = req.query;
  
  const query = { isActive: true, isFeatured: true };
  if (type) {
    query.type = type;
  }

  const now = new Date();
  query.$or = [
    { endDate: { $exists: false } },
    { endDate: { $gte: now } }
  ];

  const promotions = await Promotion.find(query)
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(10);

  res.status(200).json({
    status: 'success',
    data: { promotions }
  });
}));

// @desc    Get promotion by ID
// @route   GET /api/promotions/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);

  if (!promotion) {
    return res.status(404).json({
      status: 'error',
      message: 'Promotion not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { promotion }
  });
}));

module.exports = router;

