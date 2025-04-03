const logger = require('./logger');
const Order = require('../models/Order');
const User = require('../models/User');

const monitorSystem = async () => {
  try {
    // Track pending orders
    const pendingOrders = await Order.countDocuments({ 
      status: { $in: ['processing', 'in_transit'] } 
    });
    
    // Track active users
    const activeUsers = await User.countDocuments({
      lastActivity: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    logger.info(`System monitoring - Pending orders: ${pendingOrders}, Active users: ${activeUsers}`);
    
    return { pendingOrders, activeUsers };
  } catch (err) {
    logger.error('Monitoring job failed:', err);
    throw err;
  }
};

module.exports = { monitorSystem };