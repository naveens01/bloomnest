const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
}));

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, addresses, preferences } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      firstName,
      lastName,
      phone,
      addresses,
      preferences
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      user: user.getPublicProfile()
    }
  });
}));

// @desc    Get user orders
// @route   GET /api/users/orders
// @access  Private
router.get('/orders', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { user: req.user._id };
  if (status) query.status = status;

  const orders = await Order.find(query)
    .populate('items.product', 'name images price')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Order.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  });
}));

// @desc    Get single order
// @route   GET /api/users/orders/:id
// @access  Private
router.get('/orders/:id', asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate('items.product', 'name images price description');

  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { order }
  });
}));

// @desc    Cancel order
// @route   PUT /api/users/orders/:id/cancel
// @access  Private
router.put('/orders/:id/cancel', asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  if (!order.canCancel) {
    return res.status(400).json({
      status: 'error',
      message: 'Order cannot be cancelled in current status'
    });
  }

  await order.cancelOrder(reason);

  res.status(200).json({
    status: 'success',
    message: 'Order cancelled successfully',
    data: { order }
  });
}));

// @desc    Add review to product
// @route   POST /api/users/reviews/:productId
// @access  Private
router.post('/reviews/:productId', asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  const { productId } = req.params;

  // Check if user has already reviewed this product
  const existingReview = await Product.findOne({
    _id: productId,
    'reviews.user': req.user._id
  });

  if (existingReview) {
    return res.status(400).json({
      status: 'error',
      message: 'You have already reviewed this product'
    });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  const reviewData = {
    user: req.user._id,
    rating,
    title,
    comment
  };

  await product.addReview(reviewData);

  res.status(201).json({
    status: 'success',
    message: 'Review added successfully',
    data: { product }
  });
}));

// @desc    Update review
// @route   PUT /api/users/reviews/:productId
// @access  Private
router.put('/reviews/:productId', asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  // Find and update the user's review
  const reviewIndex = product.reviews.findIndex(
    review => review.user.toString() === req.user._id.toString()
  );

  if (reviewIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Review not found'
    });
  }

  product.reviews[reviewIndex] = {
    ...product.reviews[reviewIndex],
    rating,
    title,
    comment,
    updatedAt: new Date()
  };

  // Recalculate ratings
  const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
  product.ratings.average = totalRating / product.reviews.length;

  // Update rating distribution
  product.ratings.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  product.reviews.forEach(review => {
    product.ratings.distribution[review.rating]++;
  });

  await product.save();

  res.status(200).json({
    status: 'success',
    message: 'Review updated successfully',
    data: { product }
  });
}));

// @desc    Delete review
// @route   DELETE /api/users/reviews/:productId
// @access  Private
router.delete('/reviews/:productId', asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  // Remove the user's review
  product.reviews = product.reviews.filter(
    review => review.user.toString() !== req.user._id.toString()
  );

  // Recalculate ratings
  if (product.reviews.length > 0) {
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.ratings.average = totalRating / product.reviews.length;
    product.ratings.count = product.reviews.length;

    // Update rating distribution
    product.ratings.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    product.reviews.forEach(review => {
      product.ratings.distribution[review.rating]++;
    });
  } else {
    product.ratings.average = 0;
    product.ratings.count = 0;
    product.ratings.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }

  await product.save();

  res.status(200).json({
    status: 'success',
    message: 'Review deleted successfully',
    data: { product }
  });
}));

// @desc    Get user reviews
// @route   GET /api/users/reviews
// @access  Private
router.get('/reviews', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const products = await Product.find({
    'reviews.user': req.user._id
  })
    .select('name images reviews')
    .populate('reviews.user', 'firstName lastName');

  const userReviews = products.reduce((reviews, product) => {
    const productReviews = product.reviews
      .filter(review => review.user._id.toString() === req.user._id.toString())
      .map(review => ({
        ...review.toObject(),
        product: {
          _id: product._id,
          name: product.name,
          images: product.images
        }
      }));
    return [...reviews, ...productReviews];
  }, []);

  const total = userReviews.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReviews = userReviews.slice(startIndex, endIndex);

  res.status(200).json({
    status: 'success',
    data: {
      reviews: paginatedReviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: endIndex < total,
        hasPrev: page > 1
      }
    }
  });
}));

module.exports = router;
