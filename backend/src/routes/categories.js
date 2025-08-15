const express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    status: 'success',
    data: { categories }
  });
}));

// @desc    Get category tree
// @route   GET /api/categories/tree
// @access  Public
router.get('/tree', asyncHandler(async (req, res) => {
  const categoryTree = await Category.buildTree();

  res.status(200).json({
    status: 'success',
    data: { categories: categoryTree }
  });
}));

// @desc    Get root categories
// @route   GET /api/categories/roots
// @access  Public
router.get('/roots', asyncHandler(async (req, res) => {
  const rootCategories = await Category.findRoots();

  res.status(200).json({
    status: 'success',
    data: { categories: rootCategories }
  });
}));

// @desc    Get featured categories
// @route   GET /api/categories/featured
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const featuredCategories = await Category.findFeatured();

  res.status(200).json({
    status: 'success',
    data: { categories: featuredCategories }
  });
}));

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
router.get('/:slug', asyncHandler(async (req, res) => {
  const category = await Category.findOne({ 
    slug: req.params.slug, 
    isActive: true 
  });

  if (!category) {
    return res.status(404).json({
      status: 'error',
      message: 'Category not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { category }
  });
}));

// @desc    Get category products
// @route   GET /api/categories/:slug/products
// @access  Public
router.get('/:slug/products', asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, sort = 'newest' } = req.query;

  const category = await Category.findOne({ 
    slug: req.params.slug, 
    isActive: true 
  });

  if (!category) {
    return res.status(404).json({
      status: 'error',
      message: 'Category not found'
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
    category: category._id,
    isActive: true,
    status: 'published'
  })
    .populate('brand', 'name logo')
    .sort(sortOption)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments({
    category: category._id,
    isActive: true,
    status: 'published'
  });

  res.status(200).json({
    status: 'success',
    data: {
      category,
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

// @desc    Get subcategories
// @route   GET /api/categories/:slug/subcategories
// @access  Public
router.get('/:slug/subcategories', asyncHandler(async (req, res) => {
  const category = await Category.findOne({ 
    slug: req.params.slug, 
    isActive: true 
  });

  if (!category) {
    return res.status(404).json({
      status: 'error',
      message: 'Category not found'
    });
  }

  const subcategories = await Category.find({ 
    parent: category._id, 
    isActive: true 
  }).sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    status: 'success',
    data: { subcategories }
  });
}));

module.exports = router;
