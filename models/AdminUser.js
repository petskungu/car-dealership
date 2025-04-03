const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'inventory_manager', 'sales_manager'],
    required: true
  },
  permissions: {
    manageInventory: Boolean,
    manageOrders: Boolean,
    manageUsers: Boolean,
    viewReports: Boolean,
    systemConfig: Boolean
  },
  lastActive: Date
}, { timestamps: true });

// Set default permissions based on role
AdminUserSchema.pre('save', function(next) {
  if (this.isNew) {
    this.permissions = {
      manageInventory: ['admin', 'inventory_manager'].includes(this.role),
      manageOrders: ['admin', 'sales_manager'].includes(this.role),
      manageUsers: this.role === 'admin',
      viewReports: true,
      systemConfig: this.role === 'admin'
    };
  }
  next();
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);