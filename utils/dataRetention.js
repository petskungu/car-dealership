const User = require('../models/User');
const Order = require('../models/Order');
const logger = require('./logger');

const purgeOldData = async () => {
  try {
    const retentionDays = process.env.DATA_RETENTION_DAYS || 730;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Purge old user activity logs
    await User.updateMany(
      {},
      { $pull: { 'activity.viewedCars': { timestamp: { $lt: cutoffDate } } } }
    );

    // Archive old orders
    if (process.env.AUTO_ARCHIVE_ORDERS === 'true') {
      const result = await Order.updateMany(
        { createdAt: { $lt: cutoffDate }, status: 'delivered' },
        { $set: { archived: true } }
      );
      logger.info(`Archived ${result.nModified} old orders`);
    }

    // Handle GDPR right to be forgotten
    if (process.env.AUTO_PURGE_INACTIVE_USERS === 'true') {
      const inactiveThreshold = process.env.INACTIVE_USER_THRESHOLD || 365;
      const inactiveDate = new Date();
      inactiveDate.setDate(inactiveDate.getDate() - inactiveThreshold);

      const users = await User.find({
        lastActivity: { $lt: inactiveDate },
        role: { $ne: 'admin' }
      });

      for (const user of users) {
        await anonymizeUserData(user._id);
      }
    }
  } catch (err) {
    logger.error('Data retention job failed:', err);
  }
};

const anonymizeUserData = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    $set: {
      name: 'Deleted User',
      email: `deleted-${userId}@example.com`,
      phone: '',
      address: {},
      'activity.viewedCars': []
    },
    $unset: {
      paymentMethods: 1
    }
  });
};

module.exports = { purgeOldData, anonymizeUserData };