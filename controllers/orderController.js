exports.createOrder = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate('cart.items.car');
      
      if (user.cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }
  
      // Create order
      const order = await Order.create({
        user: user._id,
        items: user.cart.items.map(item => ({
          car: item.car._id,
          priceAtPurchase: item.car.price,
          customOptions: item.customOptions
        })),
        status: 'pending',
        payment: req.body.payment,
        shippingAddress: req.body.shippingAddress
      });
  
      // Clear user's cart
      user.cart.items = [];
      user.cart.lastUpdated = new Date();
      await user.save();
  
      // Update car purchase stats
      await Car.updateMany(
        { _id: { $in: order.items.map(i => i.car) } },
        { $inc: { 'stats.purchases': 1 } }
      );
  
      res.status(201).json({
        status: 'success',
        data: order
      });
    } catch (err) {
      next(err);
    }
  };
  
  exports.getOrderTracking = async (req, res, next) => {
    try {
      const order = await Order.findOne({
        _id: req.params.id,
        user: req.user.id
      }).populate('items.car');
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.status(200).json({
        status: 'success',
        data: order
      });
    } catch (err) {
      next(err);
    }

  };
  // @desc    Get logged in user's orders
// @route   GET /api/v1/orders/my-orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })
      .select('_id status trackingUpdates')
      .sort('-createdAt');
  
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  });