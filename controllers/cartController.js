exports.addToCart = async (req, res, next) => {
    try {
      const { carId, customOptions } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $push: {
            'cart.items': {
              car: carId,
              addedAt: new Date(),
              customOptions
            }
          },
          $set: { 'cart.lastUpdated': new Date() }
        },
        { new: true }
      ).populate('cart.items.car');
  
      res.status(200).json({
        status: 'success',
        data: user.cart
      });
    } catch (err) {
      next(err);
    }
  };
  
  exports.syncCart = async (req, res, next) => {
    try {
      const { cartItems } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            'cart.items': cartItems.map(item => ({
              car: item.carId,
              addedAt: new Date(),
              customOptions: item.customOptions || {}
            })),
            'cart.lastUpdated': new Date()
          }
        },
        { new: true }
      ).populate('cart.items.car');
  
      res.status(200).json({
        status: 'success',
        data: user.cart
      });
    } catch (err) {
      next(err);
    }
  };