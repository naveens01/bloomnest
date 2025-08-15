const express = require('express');
const Product = require('../models/Product');
const { optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get all products (public)
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    sort = 'newest',
    inStock
  } = req.query;

  // Build query
  const query = { isActive: true, status: 'published' };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }
  
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (minPrice || maxPrice) {
    query['price.current'] = {};
    if (minPrice) query['price.current'].$gte = parseFloat(minPrice);
    if (maxPrice) query['price.current'].$lte = parseFloat(maxPrice);
  }
  if (inStock === 'true') query['inventory.isInStock'] = true;

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
    case 'popular':
      sortOption = { 'ratings.count': -1 };
      break;
    case 'newest':
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  const products = await Product.find(query)
    .populate('brand', 'name logo')
    .populate('category', 'name')
    .sort(sortOption)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
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

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;

  const products = await Product.findFeatured()
    .limit(parseInt(limit))
    .select('name price images ratings brand category');

  res.status(200).json({
    status: 'success',
    data: { products }
  });
}));

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
router.get('/:slug', optionalAuth, asyncHandler(async (req, res) => {
  const product = await Product.findOne({ 
    slug: req.params.slug, 
    isActive: true, 
    status: 'published' 
  })
    .populate('brand', 'name logo description website')
    .populate('category', 'name description')
    .populate('reviews.user', 'firstName lastName avatar');

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  // Increment view count (you might want to track this separately)
  // product.views = (product.views || 0) + 1;
  // await product.save();

  res.status(200).json({
    status: 'success',
    data: { product }
  });
}));

// @desc    Search products
// @route   GET /api/products/search/:query
// @access  Public
router.get('/search/:query', optionalAuth, asyncHandler(async (req, res) => {
  const { query } = req.params;
  const { page = 1, limit = 12 } = req.query;

  const products = await Product.search(query)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments({
    $text: { $search: query },
    isActive: true,
    status: 'published'
  });

  res.status(200).json({
    status: 'success',
    data: {
      products,
      query,
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

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
router.get('/category/:categoryId', optionalAuth, asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { page = 1, limit = 12, sort = 'newest' } = req.query;

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

  const products = await Product.findByCategory(categoryId)
    .sort(sortOption)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments({
    category: categoryId,
    isActive: true,
    status: 'published'
  });

  res.status(200).json({
    status: 'success',
    data: {
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

// @desc    Get products by brand
// @route   GET /api/products/brand/:brandId
// @access  Public
router.get('/brand/:brandId', optionalAuth, asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const { page = 1, limit = 12, sort = 'newest' } = req.query;

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
    brand: brandId,
    isActive: true,
    status: 'published'
  })
    .populate('brand', 'name logo')
    .populate('category', 'name')
    .sort(sortOption)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments({
    brand: brandId,
    isActive: true,
    status: 'published'
  });

  res.status(200).json({
    status: 'success',
    data: {
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

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
router.get('/:id/related', optionalAuth, asyncHandler(async (req, res) => {
  const { limit = 4 } = req.query;

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    $or: [
      { category: product.category },
      { brand: product.brand },
      { tags: { $in: product.tags } }
    ],
    isActive: true,
    status: 'published'
  })
    .populate('brand', 'name')
    .populate('category', 'name')
    .limit(parseInt(limit));

  res.status(200).json({
    status: 'success',
    data: { products: relatedProducts }
  });
}));

// @desc    Get product filters
// @route   GET /api/products/filters
// @access  Public
router.get('/filters', asyncHandler(async (req, res) => {
  const { category, brand } = req.query;

  const query = { isActive: true, status: 'published' };
  if (category) query.category = category;
  if (brand) query.brand = brand;

  const [priceRange, brands, categories] = await Promise.all([
    Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price.current' },
          maxPrice: { $max: '$price.current' }
        }
      }
    ]),
    Product.distinct('brand', query),
    Product.distinct('category', query)
  ]);

  const filters = {
    priceRange: priceRange.length > 0 ? priceRange[0] : { minPrice: 0, maxPrice: 0 },
    brands: brands.length,
    categories: categories.length
  };

  res.status(200).json({
    status: 'success',
    data: { filters }
  });
}));

module.exports = router;
