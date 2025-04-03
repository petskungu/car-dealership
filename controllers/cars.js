const ErrorResponse = require('../utils/errorResponse');
const Car = require('../models/Car');

// @desc    Get all cars
// @route   GET /api/v1/cars
// @access  Public
exports.getCars = async (req, res, next) => {
    try {
        const cars = await Car.find();
        
        // Add current price considering discounts
        const carsWithCurrentPrice = cars.map(car => {
            const carObj = car.toObject();
            carObj.currentPrice = car.getCurrentPrice();
            return carObj;
        });

        res.status(200).json({
            success: true,
            count: cars.length,
            data: carsWithCurrentPrice
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single car
// @route   GET /api/v1/cars/:id
// @access  Public
exports.getCar = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return next(
                new ErrorResponse(`Car not found with id of ${req.params.id}`, 404)
            );
        }

        const carObj = car.toObject();
        carObj.currentPrice = car.getCurrentPrice();

        res.status(200).json({
            success: true,
            data: carObj
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new car
// @route   POST /api/v1/cars
// @access  Private/Admin
exports.createCar = async (req, res, next) => {
    try {
        const car = await Car.create(req.body);

        const carObj = car.toObject();
        carObj.currentPrice = car.getCurrentPrice();

        res.status(201).json({
            success: true,
            data: carObj
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update car
// @route   PUT /api/v1/cars/:id
// @access  Private/Admin
exports.updateCar = async (req, res, next) => {
    try {
        let car = await Car.findById(req.params.id);

        if (!car) {
            return next(
                new ErrorResponse(`Car not found with id of ${req.params.id}`, 404)
            );
        }

        car = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        const carObj = car.toObject();
        carObj.currentPrice = car.getCurrentPrice();

        res.status(200).json({
            success: true,
            data: carObj
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete car
// @route   DELETE /api/v1/cars/:id
// @access  Private/Admin
exports.deleteCar = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return next(
                new ErrorResponse(`Car not found with id of ${req.params.id}`, 404)
            );
        }

        await car.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
// In your car controller
exports.getCar = async (req, res, next) => {
    try {
      const car = await Car.findById(req.params.id);
      
      // Track view if user is logged in
      if (req.user) {
        await User.findByIdAndUpdate(req.user.id, {
          $push: {
            'activity.viewedCars': {
              car: req.params.id,
              timestamp: new Date()
            }
          }
        });
      }
      
      res.status(200).json({ success: true, data: car });
    } catch (err) {
      next(err);
    }
  };