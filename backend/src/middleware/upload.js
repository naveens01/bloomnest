const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
const productImagesDir = path.join(uploadDir, 'products');
const brandLogosDir = path.join(uploadDir, 'brands');
const categoryImagesDir = path.join(uploadDir, 'categories');
const userAvatarsDir = path.join(uploadDir, 'avatars');

// Create directories if they don't exist
[uploadDir, productImagesDir, brandLogosDir, categoryImagesDir, userAvatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Storage configuration for different upload types
const createStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
  });
};

// Product images upload (multiple files)
const productImagesUpload = multer({
  storage: createStorage(productImagesDir),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // Maximum 10 files
  }
}).array('images', 10);

// Single product image upload
const singleProductImageUpload = multer({
  storage: createStorage(productImagesDir),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).single('image');

// Brand logo upload
const brandLogoUpload = multer({
  storage: createStorage(brandLogosDir),
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
}).single('logo');

// Category image upload
const categoryImageUpload = multer({
  storage: createStorage(categoryImagesDir),
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
}).single('image');

// User avatar upload
const userAvatarUpload = multer({
  storage: createStorage(userAvatarsDir),
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB
  }
}).single('avatar');

// Generic file upload
const genericUpload = multer({
  storage: createStorage(uploadDir),
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
}).single('file');

// Error handling wrapper
const handleUploadError = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            status: 'error',
            message: 'File too large'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            status: 'error',
            message: 'Too many files'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            status: 'error',
            message: 'Unexpected file field'
          });
        }
      } else if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }
      next();
    });
  };
};

// File cleanup utility
const cleanupFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`File cleaned up: ${filePath}`);
    } catch (error) {
      console.error(`Error cleaning up file: ${filePath}`, error);
    }
  }
};

// Cleanup multiple files
const cleanupFiles = (files) => {
  if (Array.isArray(files)) {
    files.forEach(file => cleanupFile(file.path));
  } else if (files && files.path) {
    cleanupFile(files.path);
  }
};

// Generate file URL
const generateFileUrl = (req, filename, type = 'products') => {
  if (!filename) return null;
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${type}/${filename}`;
};

// Process uploaded files
const processUploadedFiles = (req, type = 'products') => {
  if (!req.files && !req.file) return [];

  const files = req.files || [req.file];
  return files.map(file => ({
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    url: generateFileUrl(req, file.filename, type)
  }));
};

// Validate image dimensions (optional)
const validateImageDimensions = (file, minWidth = 100, minHeight = 100) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.width < minWidth || img.height < minHeight) {
        reject(new Error(`Image dimensions must be at least ${minWidth}x${minHeight} pixels`));
      } else {
        resolve(true);
      }
    };
    img.onerror = () => reject(new Error('Invalid image file'));
    img.src = file.path;
  });
};

module.exports = {
  // Upload middlewares
  productImagesUpload: handleUploadError(productImagesUpload),
  singleProductImageUpload: handleUploadError(singleProductImageUpload),
  brandLogoUpload: handleUploadError(brandLogoUpload),
  categoryImageUpload: handleUploadError(categoryImageUpload),
  userAvatarUpload: handleUploadError(userAvatarUpload),
  genericUpload: handleUploadError(genericUpload),
  
  // Utility functions
  cleanupFile,
  cleanupFiles,
  generateFileUrl,
  processUploadedFiles,
  validateImageDimensions,
  
  // Direct access to multer instances (for advanced usage)
  multer: {
    productImages: productImagesUpload,
    singleProductImage: singleProductImageUpload,
    brandLogo: brandLogoUpload,
    categoryImage: categoryImageUpload,
    userAvatar: userAvatarUpload,
    generic: genericUpload
  }
};
