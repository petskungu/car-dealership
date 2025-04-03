const Car = require('../../models/Car');
const AdminAction = require('../../models/AdminAction');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

// @desc    Add new car to inventory
// @access  Private/Admin
exports.addCar = asyncHandler(async (req, res, next) => {
  const car = await Car.create(req.body);
  
  // Log admin action
  await AdminAction.create({
    admin: req.user.id,
    actionType: 'create_car',
    targetModel: 'Car',
    targetId: car._id,
    changes: req.body,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(201).json({ success: true, data: car });
});

// @desc    Change car status
// @access  Private/Admin
exports.changeCarStatus = asyncHandler(async (req, res, next) => {
  const { status, notes } = req.body;
  
  const car = await Car.findByIdAndUpdate(
    req.params.id,
    { 
      $set: { status },
      $push: { 
        statusHistory: {
          status,
          changedBy: req.user.id,
          notes
        }
      }
    },
    { new: true }
  );

  // Log admin action
  await AdminAction.create({
    admin: req.user.id,
    actionType: 'update_car_status',
    targetModel: 'Car',
    targetId: car._id,
    changes: { status },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(200).json({ success: true, data: car });
});

// @desc    Search inventory
// @access  Private/Admin
exports.searchInventory = asyncHandler(async (req, res, next) => {
  const { make, model, yearFrom, yearTo, status } = req.query;
  
  const query = {};
  
  if (make) query.make = new RegExp(make, 'i');
  if (model) query.model = new RegExp(model, 'i');
  if (yearFrom || yearTo) {
    query.year = {};
    if (yearFrom) query.year.$gte = parseInt(yearFrom);
    if (yearTo) query.year.$lte = parseInt(yearTo);
  }
  if (status) query.status = status;

  const cars = await Car.find(query)
    .populate('reservedBy', 'name email')
    .sort('-createdAt');

  res.status(200).json({ success: true, count: cars.length, data: cars });
});