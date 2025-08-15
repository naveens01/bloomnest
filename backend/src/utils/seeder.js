const mongoose = require('mongoose');
const User = require('../models/User');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Product = require('../models/Product');
require('dotenv').config();

// Sample data
const sampleBrands = [
  {
    name: 'EcoLife',
    description: 'Sustainable living products for a greener future',
    industry: 'Home & Garden',
    foundedYear: 2018,
    website: 'https://ecolife.com',
    email: 'info@ecolife.com',
    address: {
      city: 'Portland',
      state: 'Oregon',
      country: 'United States'
    }
  },
  {
    name: 'GreenTech',
    description: 'Innovative technology solutions for environmental challenges',
    industry: 'Technology',
    foundedYear: 2020,
    website: 'https://greentech.com',
    email: 'hello@greentech.com',
    address: {
      city: 'San Francisco',
      state: 'California',
      country: 'United States'
    }
  },
  {
    name: 'Nature\'s Best',
    description: 'Premium natural and organic products',
    industry: 'Health & Wellness',
    foundedYear: 2015,
    website: 'https://naturesbest.com',
    email: 'contact@naturesbest.com',
    address: {
      city: 'Boulder',
      state: 'Colorado',
      country: 'United States'
    }
  }
];

const sampleCategories = [
  {
    name: 'Home & Garden',
    description: 'Eco-friendly products for your home and garden',
    shortDescription: 'Sustainable home and garden solutions',
    color: '#22c55e',
    icon: 'home',
    sortOrder: 1
  },
  {
    name: 'Kitchen & Dining',
    description: 'Sustainable kitchen products and dining essentials',
    shortDescription: 'Eco-friendly kitchen and dining items',
    color: '#f59e0b',
    icon: 'utensils',
    sortOrder: 2
  },
  {
    name: 'Personal Care',
    description: 'Natural and organic personal care products',
    shortDescription: 'Natural personal care solutions',
    color: '#8b5cf6',
    icon: 'heart',
    sortOrder: 3
  },
  {
    name: 'Fashion & Accessories',
    description: 'Sustainable fashion and eco-friendly accessories',
    shortDescription: 'Eco-conscious fashion choices',
    color: '#ec4899',
    icon: 'shirt',
    sortOrder: 4
  }
];

const sampleProducts = [
  {
    name: 'Bamboo Water Bottle',
    description: 'Eco-friendly reusable water bottle made from sustainable bamboo. Perfect for reducing plastic waste while staying hydrated.',
    shortDescription: 'Sustainable bamboo water bottle',
    price: {
      current: 24.99,
      original: 29.99
    },
    inventory: {
      stock: 100,
      lowStockThreshold: 10
    },
    specifications: [
      { name: 'Material', value: 'Bamboo' },
      { name: 'Capacity', value: '500ml' },
      { name: 'Weight', value: '150g' }
    ],
    features: [
      'BPA-free',
      'Leak-proof design',
      'Easy to clean',
      'Eco-friendly packaging'
    ],
    tags: ['bamboo', 'water bottle', 'eco-friendly', 'reusable'],
    status: 'published',
    isFeatured: true,
    weight: { value: 0.15, unit: 'kg' },
    dimensions: { length: 8, width: 8, height: 25, unit: 'cm' }
  },
  {
    name: 'Organic Cotton Tote Bag',
    description: 'Stylish and durable tote bag made from 100% organic cotton. Perfect for shopping, beach trips, or everyday use.',
    shortDescription: 'Sustainable organic cotton tote bag',
    price: {
      current: 19.99
    },
    inventory: {
      stock: 75,
      lowStockThreshold: 15
    },
    specifications: [
      { name: 'Material', value: '100% Organic Cotton' },
      { name: 'Dimensions', value: '40cm x 35cm' },
      { name: 'Weight', value: '200g' }
    ],
    features: [
      '100% organic cotton',
      'Reinforced handles',
      'Spacious interior',
      'Machine washable'
    ],
    tags: ['cotton', 'tote bag', 'organic', 'shopping bag'],
    status: 'published',
    isFeatured: true,
    weight: { value: 0.2, unit: 'kg' },
    dimensions: { length: 40, width: 35, height: 5, unit: 'cm' }
  },
  {
    name: 'Solar-Powered Garden Lights',
    description: 'Beautiful solar-powered LED garden lights that automatically charge during the day and illuminate your garden at night.',
    shortDescription: 'Solar-powered garden lighting solution',
    price: {
      current: 39.99,
      original: 49.99
    },
    inventory: {
      stock: 50,
      lowStockThreshold: 8
    },
    specifications: [
      { name: 'Power Source', value: 'Solar' },
      { name: 'LED Type', value: 'Warm White' },
      { name: 'Runtime', value: '8-10 hours' },
      { name: 'Waterproof Rating', value: 'IP65' }
    ],
    features: [
      'Solar-powered',
      'Automatic on/off',
      'Waterproof design',
      'Easy installation',
      'Energy efficient'
    ],
    tags: ['solar', 'garden lights', 'LED', 'outdoor', 'eco-friendly'],
    status: 'published',
    isFeatured: true,
    weight: { value: 0.3, unit: 'kg' },
    dimensions: { length: 15, width: 15, height: 60, unit: 'cm' }
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected for seeding');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (adminExists) {
      console.log('👤 Admin user already exists');
      return adminExists;
    }

    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    console.log('👤 Admin user created successfully');
    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
};

// Create brands
const createBrands = async (adminUser) => {
  try {
    const brands = [];
    for (const brandData of sampleBrands) {
      const existingBrand = await Brand.findOne({ name: brandData.name });
      if (existingBrand) {
        console.log(`🏷️  Brand ${brandData.name} already exists`);
        brands.push(existingBrand);
        continue;
      }

      const brand = await Brand.create({
        ...brandData,
        createdBy: adminUser._id
      });
      brands.push(brand);
      console.log(`🏷️  Brand ${brand.name} created successfully`);
    }
    return brands;
  } catch (error) {
    console.error('❌ Error creating brands:', error);
    throw error;
  }
};

// Create categories
const createCategories = async (adminUser) => {
  try {
    const categories = [];
    for (const categoryData of sampleCategories) {
      const existingCategory = await Category.findOne({ name: categoryData.name });
      if (existingCategory) {
        console.log(`📂 Category ${categoryData.name} already exists`);
        categories.push(existingCategory);
        continue;
      }

      const category = await Category.create({
        ...categoryData,
        createdBy: adminUser._id
      });
      categories.push(category);
      console.log(`📂 Category ${category.name} created successfully`);
    }
    return categories;
  } catch (error) {
    console.error('❌ Error creating categories:', error);
    throw error;
  }
};

// Create products
const createProducts = async (adminUser, brands, categories) => {
  try {
    const products = [];
    for (let i = 0; i < sampleProducts.length; i++) {
      const productData = sampleProducts[i];
      const existingProduct = await Product.findOne({ name: productData.name });
      if (existingProduct) {
        console.log(`📦 Product ${productData.name} already exists`);
        products.push(existingProduct);
        continue;
      }

      // Assign brand and category
      const brand = brands[i % brands.length];
      const category = categories[i % categories.length];

      const product = await Product.create({
        ...productData,
        brand: brand._id,
        category: category._id,
        createdBy: adminUser._id
      });

      products.push(product);
      console.log(`📦 Product ${product.name} created successfully`);
    }
    return products;
  } catch (error) {
    console.error('❌ Error creating products:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Create admin user
    const adminUser = await createAdminUser();
    
    // Create brands
    const brands = await createBrands(adminUser);
    
    // Create categories
    const categories = await createCategories(adminUser);
    
    // Create products
    const products = await createProducts(adminUser, brands, categories);
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created: ${brands.length} brands, ${categories.length} categories, ${products.length} products`);
    
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
