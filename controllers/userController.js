// @desc    Update user's currency preference
// @route   PATCH /api/v1/users/currency
// @access  Private
exports.updateUserCurrency = asyncHandler(async (req, res, next) => {
    const { currency } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        'currencyPreferences.code': currency,
        'currencyPreferences.lastUpdated': Date.now()
      },
      { new: true }
    );
  
    res.status(200).json({
      success: true,
      data: user.currencyPreferences
    });
  });