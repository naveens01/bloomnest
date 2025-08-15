const express = require('express');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const brands = await Brand.find({ isActive: true }).sort({ name: 1 });

  res.status(200).json({
    status: 'success',
    data: { brands }
  });
}));

// @desc    Get featured brands
// @route   GET /api/brands/featured
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const brands = await Brand.findFeatured();

  res.status(200).json({
    status: 'success',
    data: { brands }
  });
}));

// @desc    Get brand by slug
// @route   GET /api/brands/:slug
// @access  Public
router.get('/:slug', asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ 
    slug: req.params.slug, 
    isActive: true 
  });

  if (!brand) {
    return res.status(404).json({
      status: 'error',
      message: 'Brand not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { brand }
  });
}));

// @desc    Get brand products
// @route   GET /api/brands/:slug/products
// @access  Public
router.get('/:slug/products', asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, sort = 'newest' } = req.query;

  const brand = await Brand.findOne({ 
    slug: req.params.slug, 
    isActive: true 
  });

  if (!brand) {
    return res.status(404).json({
      status: 'error',
      message: 'Brand not found'
    });
  }

  // Build sort
  let sortOption = {};
  switch (sort) {
    case 'price-low':
      sortOption = { 'price.current': 1 };
      break;
    case 'price-high':
      sortOption = { 'price.current': -1 };
      break;
    case 'rating':
      sortOption = { 'ratings.average': -1 };
      break;
    case 'newest':
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  const products = await Product.find({
    brand: brand._id,
    isActive: true,
    status: 'published'
  })
    .populate('category', 'name')
    .sort(sortOption)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments({
    brand: brand._id,
    isActive: true,
    status: 'published'
  });

  res.status(200).json({
    status: 'success',
    data: {
      brand,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  });
}));

module.exports = router;
