const Order = require('../../models/Order');
const User = require('../../models/User');
const AdminAction = require('../../models/AdminAction');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');
const sendEmail = require('../../utils/sendEmail');

// @desc    Update order status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, customerMessage } = req.body;
  
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { 
      $set: { status },
      $push: { 
        activityLog: {
          action: 'status_update',
          details: `Status changed to ${status}`,
          performedBy: req.user.id,
          customerVisible: true
        }
      }
    },
    { new: true }
  ).populate('user', 'email name');

  // Notify customer if status is customer-visible
  if (customerMessage) {
    await sendEmail({
      email: order.user.email,
      subject: `Your Order #${order._id} Status Update`,
      message: customerMessage
    });

    order.notifications.push({
      type: 'status_update_email',
      sentAt: new Date(),
      recipient: order.user._id,
      content: customerMessage
    });
    await order.save();
  }

  // Log admin action
  await AdminAction.create({
    admin: req.user.id,
    actionType: 'update_order_status',
    targetModel: 'Order',
    targetId: order._id,
    changes: { status },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(200).json({ success: true, data: order });
});

// @desc    Add admin note to order
// @access  Private/Admin
exports.addOrderNote = asyncHandler(async (req, res, next) => {
  const { content, isInternal } = req.body;
  
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { 
      $push: { 
        adminNotes: {
          content,
          createdBy: req.user.id,
          isInternal
        }
      }
    },
    { new: true }
  );

  // Log admin action
  await AdminAction.create({
    admin: req.user.id,
    actionType: 'add_order_note',
    targetModel: 'Order',
    targetId: order._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(200).json({ success: true, data: order });
});

// @desc    Search orders
// @access  Private/Admin
exports.searchOrders = asyncHandler(async (req, res, next) => {
  const { status, customerName, dateFrom, dateTo } = req.query;
  
  const query = {};
  
  if (status) query.status = status;
  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) query.createdAt.$lte = new Date(dateTo);
  }

  let orders = await Order.find(query)
    .populate('user', 'name email')
    .populate('items.car')
    .sort('-createdAt');

  // Filter by customer name if provided
  if (customerName) {
    const nameRegex = new RegExp(customerName, 'i');
    orders = orders.filter(order => 
      order.user && nameRegex.test(order.user.name)
    );
  }

  res.status(200).json({ 
    success: true, 
    count: orders.length, 
    data: orders 
  });
});