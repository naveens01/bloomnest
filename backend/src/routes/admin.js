const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const User = require('../models/User');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { 
  productImagesUpload, 
  brandLogoUpload, 
  categoryImageUpload,
  processUploadedFiles,
  cleanupFiles,
  generateFileUrl
} = require('../middleware/upload');

const router = express.Router();

// Apply admin middleware to all routes
router.use(protect, adminOnly);

// ==================== DASHBOARD ====================
// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin only
router.get('/dashboard', asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
    lowStockProducts,
    topProducts
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { 'payment.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName email'),
    Product.find({ 'inventory.stock': { $lte: 10 } }).limit(10),
    Product.find({ isActive: true, status: 'published' })
      .sort({ 'ratings.average': -1 })
      .limit(10)
      .select('name price ratings images')
  ]);

  const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenue
      },
      recentOrders,
      lowStockProducts,
      topProducts
    }
  });
}));

// ==================== USER MANAGEMENT ====================
// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
router.get('/users', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, role, status } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  if (role) query.role = role;
  if (status !== undefined) query.isActive = status === 'active';

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  });
}));

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Admin only
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
}));

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Admin only
router.put('/users/:id', asyncHandler(async (req, res) => {
  const { firstName, lastName, email, role, isActive, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName,
      lastName,
      email,
      role,
      isActive,
      phone,
      updatedBy: req.user._id
    },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
    data: { user }
  });
}));

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin only
router.delete('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  // Check if user has orders
  const hasOrders = await Order.exists({ user: user._id });
  if (hasOrders) {
    return res.status(400).json({
      status: 'error',
      message: 'Cannot delete user with existing orders'
    });
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully'
  });
}));

// ==================== PRODUCT MANAGEMENT ====================
// @desc    Get all products
// @route   GET /api/admin/products
// @access  Admin only
router.get('/products', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, brand, status } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (status) query.status = status;

  const products = await Product.find(query)
    .populate('brand', 'name')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  });
}));

// @desc    Create product
// @route   POST /api/admin/products
// @access  Admin only
router.post('/products', productImagesUpload, asyncHandler(async (req, res) => {
  const productData = req.body;
  
  // Parse nested form data (price.current, inventory.stock, etc.)
  if (productData['price.current']) {
    productData.price = {
      current: parseFloat(productData['price.current']),
      original: productData['price.original'] ? parseFloat(productData['price.original']) : undefined,
      currency: 'USD'
    };
    delete productData['price.current'];
    delete productData['price.original'];
  }
  
  if (productData['inventory.stock']) {
    productData.inventory = {
      stock: parseInt(productData['inventory.stock']),
      isInStock: parseInt(productData['inventory.stock']) > 0
    };
    delete productData['inventory.stock'];
  }
  
  // Handle arrays (features, tags)
  if (productData.features && !Array.isArray(productData.features)) {
    productData.features = [productData.features];
  }
  if (productData.tags && !Array.isArray(productData.tags)) {
    productData.tags = [productData.tags];
  }
  
  // Process uploaded images
  const uploadedFiles = processUploadedFiles(req, 'products');
  if (uploadedFiles.length > 0) {
    productData.images = uploadedFiles.map((file, index) => ({
      url: file.url,
      alt: file.originalName,
      isPrimary: index === 0,
      order: index
    }));
  }

  // Add creator info
  productData.createdBy = req.user._id;

  const product = await Product.create(productData);
  await product.populate(['brand', 'category']);

  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    data: { product }
  });
}));

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Admin only
router.put('/products/:id', productImagesUpload, asyncHandler(async (req, res) => {
  const productData = req.body;
  
  // Parse nested form data (price.current, inventory.stock, etc.)
  if (productData['price.current']) {
    productData.price = {
      current: parseFloat(productData['price.current']),
      original: productData['price.original'] ? parseFloat(productData['price.original']) : undefined,
      currency: 'USD'
    };
    delete productData['price.current'];
    delete productData['price.original'];
  }
  
  if (productData['inventory.stock']) {
    productData.inventory = {
      stock: parseInt(productData['inventory.stock']),
      isInStock: parseInt(productData['inventory.stock']) > 0
    };
    delete productData['inventory.stock'];
  }
  
  // Handle arrays (features, tags)
  if (productData.features && !Array.isArray(productData.features)) {
    productData.features = [productData.features];
  }
  if (productData.tags && !Array.isArray(productData.tags)) {
    productData.tags = [productData.tags];
  }
  
  // Process uploaded images if any
  const uploadedFiles = processUploadedFiles(req, 'products');
  if (uploadedFiles.length > 0) {
    const existingProduct = await Product.findById(req.params.id);
    if (existingProduct && existingProduct.images.length > 0) {
      // Merge existing and new images
      productData.images = [
        ...existingProduct.images,
        ...uploadedFiles.map((file, index) => ({
          url: file.url,
          alt: file.originalName,
          isPrimary: false,
          order: existingProduct.images.length + index
        }))
      ];
    } else {
      productData.images = uploadedFiles.map((file, index) => ({
        url: file.url,
        alt: file.originalName,
        isPrimary: index === 0,
        order: index
      }));
    }
  }

  // Add updater info
  productData.updatedBy = req.user._id;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    productData,
    { new: true, runValidators: true }
  ).populate(['brand', 'category']);

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Product updated successfully',
    data: { product }
  });
}));

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Admin only
router.delete('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  // Clean up product images
  if (product.images && product.images.length > 0) {
    cleanupFiles(product.images.map(img => ({ path: img.url })));
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully'
  });
}));

// ==================== BRAND MANAGEMENT ====================
// @desc    Get all brands
// @route   GET /api/admin/brands
// @access  Admin only
router.get('/brands', asyncHandler(async (req, res) => {
  const brands = await Brand.find().sort({ name: 1 });
  
  // Transform logo base64 data to data URI for frontend
  const brandsWithDataUri = brands.map(brand => {
    const brandObj = brand.toObject();
    if (brandObj.logo && brandObj.logo.data) {
      brandObj.logo.url = `data:${brandObj.logo.contentType || 'image/jpeg'};base64,${brandObj.logo.data}`;
    }
    return brandObj;
  });

  res.status(200).json({
    status: 'success',
    data: { brands: brandsWithDataUri }
  });
}));

// @desc    Create brand
// @route   POST /api/admin/brands
// @access  Admin only
router.post('/brands', brandLogoUpload, asyncHandler(async (req, res) => {
  const brandData = req.body;
  
  // Generate slug from name if not provided
  if (!brandData.slug && brandData.name) {
    brandData.slug = brandData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Process uploaded logo if any - store as base64 in database
  if (req.file) {
    try {
      // Read the file and convert to base64
      const fileBuffer = await fs.readFile(req.file.path);
      const base64Data = fileBuffer.toString('base64');
      const contentType = req.file.mimetype || 'image/jpeg';
      
      // Store in database as base64
      brandData.logo = {
        data: base64Data,
        contentType: contentType,
        alt: req.file.originalname
      };
      
      // Delete the temporary file since we're storing in DB
      await fs.unlink(req.file.path);
    } catch (error) {
      console.error('Error processing logo:', error);
      // Cleanup file on error
      if (req.file && req.file.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting temp file:', unlinkError);
        }
      }
      throw error;
    }
  }

  // Add creator info
  brandData.createdBy = req.user._id;

  const brand = await Brand.create(brandData);
  // Populate virtuals to get productCount
  await brand.populate('productCount');

  // Transform logo base64 data to data URI for frontend
  const brandObj = brand.toObject();
  if (brandObj.logo && brandObj.logo.data) {
    brandObj.logo.url = `data:${brandObj.logo.contentType || 'image/jpeg'};base64,${brandObj.logo.data}`;
  }

  res.status(201).json({
    status: 'success',
    message: 'Brand created successfully',
    data: { brand: brandObj }
  });
}));

// @desc    Update brand
// @route   PUT /api/admin/brands/:id
// @access  Admin only
router.put('/brands/:id', brandLogoUpload, asyncHandler(async (req, res) => {
  const brandData = req.body;
  
  // Generate slug from name if name changed and slug not provided
  if (brandData.name && !brandData.slug) {
    brandData.slug = brandData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Process uploaded logo if any - store as base64 in database
  if (req.file) {
    try {
      // Read the file and convert to base64
      const fileBuffer = await fs.readFile(req.file.path);
      const base64Data = fileBuffer.toString('base64');
      const contentType = req.file.mimetype || 'image/jpeg';
      
      // Store in database as base64
      brandData.logo = {
        data: base64Data,
        contentType: contentType,
        alt: req.file.originalname
      };
      
      // Delete the temporary file since we're storing in DB
      await fs.unlink(req.file.path);
    } catch (error) {
      console.error('Error processing logo:', error);
      // Cleanup file on error
      if (req.file && req.file.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting temp file:', unlinkError);
        }
      }
      throw error;
    }
  }

  // Add updater info
  brandData.updatedBy = req.user._id;

  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    brandData,
    { new: true, runValidators: true }
  );

  if (!brand) {
    return res.status(404).json({
      status: 'error',
      message: 'Brand not found'
    });
  }

  // Transform logo base64 data to data URI for frontend
  const brandObj = brand.toObject();
  if (brandObj.logo && brandObj.logo.data) {
    brandObj.logo.url = `data:${brandObj.logo.contentType || 'image/jpeg'};base64,${brandObj.logo.data}`;
  }

  res.status(200).json({
    status: 'success',
    message: 'Brand updated successfully',
    data: { brand: brandObj }
  });
}));

// @desc    Delete brand
// @route   DELETE /api/admin/brands/:id
// @access  Admin only
router.delete('/brands/:id', asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  
  if (!brand) {
    return res.status(404).json({
      status: 'error',
      message: 'Brand not found'
    });
  }

  // Check if brand has products
  const hasProducts = await Product.exists({ brand: brand._id });
  if (hasProducts) {
    return res.status(400).json({
      status: 'error',
      message: 'Cannot delete brand with existing products'
    });
  }

  // Clean up brand logo
  if (brand.logo && brand.logo.url) {
    cleanupFiles([{ path: brand.logo.url }]);
  }

  await Brand.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Brand deleted successfully'
  });
}));

// ==================== CATEGORY MANAGEMENT ====================
// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Admin only
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    status: 'success',
    data: { categories }
  });
}));

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Admin only
router.post('/categories', categoryImageUpload, asyncHandler(async (req, res) => {
  const categoryData = req.body;
  
  // Process uploaded image if any
  if (req.file) {
    const filename = path.basename(req.file.path);
    categoryData.image = {
      url: generateFileUrl(req, filename, 'categories'),
      alt: req.file.originalname
    };
  }

  // Add creator info
  categoryData.createdBy = req.user._id;

  const category = await Category.create(categoryData);

  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    data: { category }
  });
}));

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Admin only
router.put('/categories/:id', categoryImageUpload, asyncHandler(async (req, res) => {
  const categoryData = req.body;
  
  // Process uploaded image if any
  if (req.file) {
    const filename = path.basename(req.file.path);
    categoryData.image = {
      url: generateFileUrl(req, filename, 'categories'),
      alt: req.file.originalname
    };
  }

  // Add updater info
  categoryData.updatedBy = req.user._id;

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    categoryData,
    { new: true, runValidators: true }
  );

  if (!category) {
    return res.status(404).json({
      status: 'error',
      message: 'Category not found'
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Category updated successfully',
    data: { category }
  });
}));

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Admin only
router.delete('/categories/:id', asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return res.status(404).json({
      status: 'error',
      message: 'Category not found'
    });
  }

  // Check if category has products
  const hasProducts = await Product.exists({ category: category._id });
  if (hasProducts) {
    return res.status(400).json({
      status: 'error',
      message: 'Cannot delete category with existing products'
    });
  }

  // Check if category has subcategories
  const hasSubcategories = await Category.exists({ parent: category._id });
  if (hasSubcategories) {
    return res.status(400).json({
      status: 'error',
      message: 'Cannot delete category with subcategories'
    });
  }

  // Clean up category image
  if (category.image && category.image.url) {
    cleanupFiles([{ path: category.image.url }]);
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully'
  });
}));

// ==================== ORDER MANAGEMENT ====================
// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Admin only
router.get('/orders', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;

  const query = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'shipping.address.city': { $regex: search, $options: 'i' } }
    ];
  }

  const orders = await Order.find(query)
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Order.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  });
}));

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Admin only
router.put('/orders/:id/status', asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  await order.updateStatus(status, notes);

  res.status(200).json({
    status: 'success',
    message: 'Order status updated successfully',
    data: { order }
  });
}));

// @desc    Add tracking to order
// @route   PUT /api/admin/orders/:id/tracking
// @access  Admin only
router.put('/orders/:id/tracking', asyncHandler(async (req, res) => {
  const { trackingNumber, estimatedDelivery } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  await order.addTracking(trackingNumber, estimatedDelivery);

  res.status(200).json({
    status: 'success',
    message: 'Tracking information added successfully',
    data: { order }
  });
}));

module.exports = router;
