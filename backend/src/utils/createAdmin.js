const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Default admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bloomnest.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || 'Admin';
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || 'User';

// Connect to database
const connectDB = async () => {
  try {
    const DB_TARGET = process.env.DB_TARGET || 'local';
    const mongodbUri = DB_TARGET === 'atlas'
      ? (process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI_PROD)
      : process.env.MONGODB_URI;

    await mongoose.connect(mongodbUri);
    console.log(`✅ Connected to MongoDB (${DB_TARGET})`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: ADMIN_EMAIL },
        { role: 'admin', isActive: true }
      ]
    });

    if (existingAdmin) {
      if (existingAdmin.role === 'admin') {
        console.log('👤 Admin user already exists:');
        console.log(`   Email: ${existingAdmin.email}`);
        console.log(`   Name: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
        console.log(`   Role: ${existingAdmin.role}`);
        return existingAdmin;
      } else {
        // Update existing user to admin
        existingAdmin.role = 'admin';
        existingAdmin.isActive = true;
        await existingAdmin.save();
        console.log('👤 Updated existing user to admin:');
        console.log(`   Email: ${existingAdmin.email}`);
        console.log(`   Name: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
        return existingAdmin;
      }
    }

    // Create new admin user
    const adminUser = await User.create({
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Login credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Name: ${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`);
    console.log(`   Role: admin`);
    console.log('\n⚠️  Please change the password after first login!');

    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    console.log('🚀 Creating admin user...\n');
    
    // Connect to database
    await connectDB();
    
    // Create admin user
    await createAdminUser();
    
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    console.log('✅ Done!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createAdminUser };

