exports.anonymizeUser = async (userId) => {
    await User.findByIdAndUpdate(userId, {
      $set: {
        name: 'Deleted User',
        email: `deleted_${userId}@example.com`,
        phone: '',
        'preferences.preferredMakes': [],
        'activity.viewedCars': [],
        'activity.searchHistory': [],
        'shippingAddress.street': '',
        'shippingAddress.city': '',
        'payment.method': ''
      }
    });
  };
  
  exports.exportUserData = async (userId) => {
    return await User.findById(userId)
      .select('-password -sessions')
      .lean();
  };