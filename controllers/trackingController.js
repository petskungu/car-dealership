const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Order = require('../models/Order');

// @desc    Get order tracking information
// @route   GET /api/v1/tracking/:orderId
// @access  Private (owner or admin)
exports.getOrderTracking = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    $or: [
      { user: req.user.id },
      { $and: [{ user: { $ne: req.user.id } }, { adminAccess: req.user.id }] }
    ]
  }).populate('user', 'name email');

  if (!order) {
    return next(new ErrorResponse(`Order not found or not authorized`, 404));
  }

  res.status(200).json({
    success: true,
    data: order.trackingUpdates
  });
});

// Rest of the controller methods remain the same...

// @desc    Update order tracking status
// @route   PUT /api/v1/tracking/:orderId/status
// @access  Private (admin only)
exports.updateTrackingStatus = asyncHandler(async (req, res, next) => {
  const { status, message, isCustomerVisible } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    {
      $push: {
        trackingUpdates: {
          status,
          message: message || `Status updated to ${status}`,
          isCustomerVisible: isCustomerVisible !== false,
          updatedBy: req.user.id
        }
      },
      status
    },
    { new: true }
  );

  if (!order) {
    return next(new ErrorResponse(`Order not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: order.trackingUpdates
  });
});

// @desc    Add tracking update
// @route   POST /api/v1/tracking/:orderId/updates
// @access  Private (admin only)
exports.addTrackingUpdate = asyncHandler(async (req, res, next) => {
  const { message, location, isCustomerVisible } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    {
      $push: {
        trackingUpdates: {
          message,
          location,
          isCustomerVisible: isCustomerVisible !== false,
          updatedBy: req.user.id
        }
      }
    },
    { new: true }
  );

  if (!order) {
    return next(new ErrorResponse(`Order not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: order.trackingUpdates
  });
});

// @desc    Get customer-facing tracking information
// @route   GET /api/v1/tracking/customer/:orderId
// @access  Private (owner only)
exports.getCustomerTracking = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    user: req.user.id
  });

  if (!order) {
    return next(new ErrorResponse(`Order not found or not authorized`, 404));
  }

  // Filter only customer-visible updates
  const customerUpdates = order.trackingUpdates.filter(
    update => update.isCustomerVisible
  );

  res.status(200).json({
    success: true,
    data: customerUpdates
  });
});