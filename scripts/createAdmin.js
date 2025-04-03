require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AdminUser = require('../models/AdminUser');

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error:', err));

// Admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'pngumi25@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'peterpetskungu';

async function createAdminAccount() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL, role: 'admin' });
    if (existingAdmin) {
      console.log('Admin account already exists');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Create base user
    const user = await User.create({
      name: 'System Admin',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      verified: true
    });

    // Create admin profile with full permissions
    await AdminUser.create({
      user: user._id,
      role: 'admin',
      permissions: {
        manageInventory: true,
        manageOrders: true,
        manageUsers: true,
        viewReports: true,
        systemConfig: true
      }
    });

    console.log('Admin account created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin account:', err);
    process.exit(1);
  }
}

createAdminAccount();