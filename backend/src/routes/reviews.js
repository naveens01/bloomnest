const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get reviews for a product
// @route   GET /api/products/:slug/reviews
// @access  Public
router.get('/products/:slug/reviews', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { page = 1, limit = 10, sort = 'newest' } = req.query;
  
  // Find product by slug
  const product = await Product.findOne({ slug });
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Build sort query
  let sortQuery = { createdAt: -1 }; // newest first
  if (sort === 'highest') sortQuery = { rating: -1, createdAt: -1 };
  if (sort === 'lowest') sortQuery = { rating: 1, createdAt: -1 };
  
  const skip = (page - 1) * limit;
  
  const [reviews, total, stats] = await Promise.all([
    Review.find({
      reviewType: 'product',
      targetId: product._id,
      isApproved: true
    })
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-createdBy -__v'),
    Review.countDocuments({
      reviewType: 'product',
      targetId: product._id,
      isApproved: true
    }),
    Review.getAverageRating('product', product._id)
  ]);
  
  const distribution = await Review.getRatingDistribution('product', product._id);
  
  res.status(200).json({
    status: 'success',
    data: {
      reviews,
      stats: {
        averageRating: stats.averageRating,
        totalReviews: stats.totalReviews,
        distribution
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: skip + reviews.length < total,
        hasPrev: page > 1
      }
    }
  });
}));

// @desc    Get reviews for a category
// @route   GET /api/categories/:slug/reviews
// @access  Public
router.get('/categories/:slug/reviews', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { page = 1, limit = 10, sort = 'newest' } = req.query;
  
  // Find category by slug
  const category = await Category.findOne({ slug });
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  // Build sort query
  let sortQuery = { createdAt: -1 };
  if (sort === 'highest') sortQuery = { rating: -1, createdAt: -1 };
  if (sort === 'lowest') sortQuery = { rating: 1, createdAt: -1 };
  
  const skip = (page - 1) * limit;
  
  const [reviews, total, stats] = await Promise.all([
    Review.find({
      reviewType: 'category',
      targetId: category._id,
      isApproved: true
    })
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-createdBy -__v'),
    Review.countDocuments({
      reviewType: 'category',
      targetId: category._id,
      isApproved: true
    }),
    Review.getAverageRating('category', category._id)
  ]);
  
  const distribution = await Review.getRatingDistribution('category', category._id);
  
  res.status(200).json({
    status: 'success',
    data: {
      reviews,
      stats: {
        averageRating: stats.averageRating,
        totalReviews: stats.totalReviews,
        distribution
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: skip + reviews.length < total,
        hasPrev: page > 1
      }
    }
  });
}));

// @desc    Get reviews for a brand
// @route   GET /api/brands/:slug/reviews
// @access  Public
router.get('/brands/:slug/reviews', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { page = 1, limit = 10, sort = 'newest' } = req.query;
  
  // Find brand by slug
  const brand = await Brand.findOne({ slug });
  
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  
  // Build sort query
  let sortQuery = { createdAt: -1 };
  if (sort === 'highest') sortQuery = { rating: -1, createdAt: -1 };
  if (sort === 'lowest') sortQuery = { rating: 1, createdAt: -1 };
  
  const skip = (page - 1) * limit;
  
  const [reviews, total, stats] = await Promise.all([
    Review.find({
      reviewType: 'brand',
      targetId: brand._id,
      isApproved: true
    })
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-createdBy -__v'),
    Review.countDocuments({
      reviewType: 'brand',
      targetId: brand._id,
      isApproved: true
    }),
    Review.getAverageRating('brand', brand._id)
  ]);
  
  const distribution = await Review.getRatingDistribution('brand', brand._id);
  
  res.status(200).json({
    status: 'success',
    data: {
      reviews,
      stats: {
        averageRating: stats.averageRating,
        totalReviews: stats.totalReviews,
        distribution
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: skip + reviews.length < total,
        hasPrev: page > 1
      }
    }
  });
}));

module.exports = router;

// Made with Bob
