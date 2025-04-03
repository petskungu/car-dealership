const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getMyOrders
} = require('../controllers/orderController');

const router = express.Router();

// @desc    Get current user's orders
// @route   GET /api/v1/orders/my-orders
// @access  Private
router.get('/my-orders', protect, getMyOrders);

module.exports = router;