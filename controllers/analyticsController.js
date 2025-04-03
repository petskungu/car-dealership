const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Car = require('../models/Car');
const Order = require('../models/Order');

// @desc    Get user activity
// @route   GET /api/v1/analytics/user-activity/:userId
// @access  Private
exports.getUserActivity = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId)
    .select('activity purchaseHistory')
    .populate({
      path: 'activity.viewedCars.car',
      select: 'make model year price image'
    })
    .populate({
      path: 'purchaseHistory',
      select: 'items totalPrice createdAt status',
      populate: {
        path: 'items.car',
        select: 'make model year'
      }
    });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.userId}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {
      viewedCars: user.activity.viewedCars,
      purchaseHistory: user.purchaseHistory
    }
  });
});

// @desc    Get car popularity data
// @route   GET /api/v1/analytics/car-popularity
// @access  Private/Admin
exports.getCarPopularity = asyncHandler(async (req, res, next) => {
  const cars = await Car.aggregate([
    {
      $project: {
        make: 1,
        model: 1,
        year: 1,
        price: 1,
        image: 1,
        viewCount: { $size: "$activity.viewedBy" },
        wishlistCount: { $size: "$wishlistedBy" },
        purchaseCount: 1,
        status: 1
      }
    },
    { $sort: { viewCount: -1 } },
    { $limit: 10 }
  ]);

  res.status(200).json({
    success: true,
    count: cars.length,
    data: cars
  });
});

// @desc    Get sales data
// @route   GET /api/v1/analytics/sales-data
// @access  Private/Admin
exports.getSalesData = asyncHandler(async (req, res, next) => {
  // Default to last 30 days if no date range provided
  const dateFrom = req.query.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const dateTo = req.query.dateTo || new Date();

  const salesData = await Order.aggregate([
    {
      $match: {
        status: 'delivered',
        createdAt: {
          $gte: new Date(dateFrom),
          $lte: new Date(dateTo)
        }
      }
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
        count: { $sum: 1 },
        byMake: {
          $push: {
            make: "$items.car.make",
            price: "$totalPrice"
          }
        }
      }
    },
    {
      $unwind: "$byMake"
    },
    {
      $group: {
        _id: "$byMake.make",
        totalSales: { $sum: "$byMake.price" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { totalSales: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    dateRange: {
      from: dateFrom,
      to: dateTo
    },
    data: salesData
  });
});