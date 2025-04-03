const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getOrderTracking,
  updateTrackingStatus,
  addTrackingUpdate,
  getCustomerTracking
} = require('../controllers/trackingController');

const router = express.Router();

// Protect all routes
router.use(protect);

// @desc    Get order tracking information
// @route   GET /api/v1/tracking/:orderId
// @access  Private (owner or admin)
router.get('/:orderId', getOrderTracking);

// @desc    Update order tracking status
// @route   PUT /api/v1/tracking/:orderId/status
// @access  Private (admin only)
router.put('/:orderId/status', updateTrackingStatus);

// @desc    Add tracking update
// @route   POST /api/v1/tracking/:orderId/updates
// @access  Private (admin only)
router.post('/:orderId/updates', addTrackingUpdate);

// @desc    Get customer-facing tracking information
// @route   GET /api/v1/tracking/customer/:orderId
// @access  Private (owner only)
router.get('/customer/:orderId', getCustomerTracking);

module.exports = router;