const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', asyncHandler(async (req, res) => {
  const {
    items,
    shippingAddress,
    shippingMethod,
    paymentMethod,
    notes,
    isGift,
    giftMessage
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Order must contain at least one item'
    });
  }

  // Validate products and calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(400).json({
        status: 'error',
        message: `Product ${item.product} not found`
      });
    }

    if (!product.isActive || product.status !== 'published') {
      return res.status(400).json({
        status: 'error',
        message: `Product ${product.name} is not available`
      });
    }

    if (product.inventory.stock < item.quantity) {
      return res.status(400).json({
        status: 'error',
        message: `Insufficient stock for ${product.name}`
      });
    }

    const itemTotal = product.price.current * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price.current,
      total: itemTotal,
      variant: item.variant
    });

    // Update product stock
    await product.updateStock(item.quantity, 'decrease');
  }

  // Calculate shipping cost based on method
  let shippingCost = 0;
  switch (shippingMethod) {
    case 'standard':
      shippingCost = 5.99;
      break;
    case 'express':
      shippingCost = 12.99;
      break;
    case 'overnight':
      shippingCost = 24.99;
      break;
    case 'pickup':
      shippingCost = 0;
      break;
    default:
      shippingCost = 5.99;
  }

  // Calculate tax (simplified - you might want to use a tax service)
  const taxRate = 0.08; // 8% tax rate
  const taxAmount = subtotal * taxRate;

  // Calculate total
  const total = subtotal + taxAmount + shippingCost;

  // Create order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    subtotal,
    tax: {
      amount: taxAmount,
      rate: taxRate * 100,
      type: 'percentage'
    },
    shipping: {
      method: shippingMethod,
      cost: shippingCost,
      address: shippingAddress
    },
    payment: {
      method: paymentMethod,
      amount: total
    },
    notes: {
      customer: notes
    },
    isGift,
    giftMessage,
    total
  });

  // Populate order details
  await order.populate([
    { path: 'items.product', select: 'name images price' },
    { path: 'user', select: 'firstName lastName email' }
  ]);

  res.status(201).json({
    status: 'success',
    message: 'Order created successfully',
    data: { order }
  });
}));

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
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

// @desc    Get order tracking
// @route   GET /api/orders/:id/tracking
// @access  Private
router.get('/:id/tracking', asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  }).select('orderNumber status shipping.trackingNumber shipping.estimatedDelivery shipping.actualDelivery');

  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      orderNumber: order.orderNumber,
      status: order.status,
      tracking: {
        trackingNumber: order.shipping.trackingNumber,
        estimatedDelivery: order.shipping.estimatedDelivery,
        actualDelivery: order.shipping.actualDelivery
      }
    }
  });
}));

// @desc    Get order invoice
// @route   GET /api/orders/:id/invoice
// @access  Private
router.get('/:id/invoice', asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  })
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name price');

  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  // Generate invoice data
  const invoice = {
    orderNumber: order.orderNumber,
    orderDate: order.createdAt,
    customer: {
      name: `${order.user.firstName} ${order.user.lastName}`,
      email: order.user.email
    },
    items: order.items.map(item => ({
      product: item.product.name,
      quantity: item.quantity,
      price: item.price,
      total: item.total
    })),
    subtotal: order.subtotal,
    tax: order.tax,
    shipping: order.shipping,
    total: order.total,
    status: order.status
  };

  res.status(200).json({
    status: 'success',
    data: { invoice }
  });
}));

// @desc    Reorder
// @route   POST /api/orders/:id/reorder
// @access  Private
router.post('/:id/reorder', asyncHandler(async (req, res) => {
  const originalOrder = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate('items.product');

  if (!originalOrder) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  // Check if products are still available
  const reorderItems = [];
  let subtotal = 0;

  for (const item of originalOrder.items) {
    const product = await Product.findById(item.product._id);
    if (product && product.isActive && product.status === 'published' && product.inventory.stock >= item.quantity) {
      const itemTotal = product.price.current * item.quantity;
      subtotal += itemTotal;

      reorderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price.current,
        total: itemTotal
      });
    }
  }

  if (reorderItems.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'No products from this order are currently available'
    });
  }

  // Create new order
  const newOrder = await Order.create({
    user: req.user._id,
    items: reorderItems,
    subtotal,
    tax: {
      amount: subtotal * 0.08,
      rate: 8,
      type: 'percentage'
    },
    shipping: {
      method: 'standard',
      cost: 5.99,
      address: originalOrder.shipping.address
    },
    payment: {
      method: 'pending',
      amount: subtotal + (subtotal * 0.08) + 5.99
    },
    notes: {
      customer: `Reorder from order ${originalOrder.orderNumber}`
    },
    total: subtotal + (subtotal * 0.08) + 5.99
  });

  await newOrder.populate('items.product', 'name images price');

  res.status(201).json({
    status: 'success',
    message: 'Reorder created successfully',
    data: { order: newOrder }
  });
}));

module.exports = router;
