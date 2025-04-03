const ErrorResponse = require('../utils/errorResponse');
const Order = require('../models/Order');
const Car = require('../models/Car');

// @desc    Get all orders
// @route   GET /api/v1/orders
// @route   GET /api/v1/users/:userId/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
    try {
        let query;
        
        if (req.params.userId) {
            query = Order.find({ user: req.params.userId });
        } else {
            query = Order.find().populate({
                path: 'user',
                select: 'name email'
            });
        }

        const orders = await query.populate({
            path: 'cars.car',
            select: 'make model year image'
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate({
            path: 'user',
            select: 'name email'
        }).populate({
            path: 'cars.car',
            select: 'make model year image'
        });

        if (!order) {
            return next(
                new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is order owner or admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User not authorized to access this order`, 401)
            );
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        // Check if cars exist and get their current prices
        const carsWithPrices = await Promise.all(
            req.body.cars.map(async item => {
                const car = await Car.findById(item.car);
                if (!car) {
                    throw new ErrorResponse(`Car not found with id of ${item.car}`, 404);
                }
                return {
                    car: item.car,
                    quantity: item.quantity,
                    priceAtPurchase: car.getCurrentPrice()
                };
            })
        );

        // Calculate total price
        const totalPrice = carsWithPrices.reduce(
            (total, item) => total + (item.priceAtPurchase * item.quantity),
            0
        );

        // Create order
        const order = await Order.create({
            user: req.body.user,
            cars: carsWithPrices,
            totalPrice,
            paymentMethod: req.body.paymentMethod,
            shippingAddress: req.body.shippingAddress
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res, next) => {
    try {
        let order = await Order.findById(req.params.id);

        if (!order) {
            return next(
                new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
            );
        }

        // Only allow updating status
        if (req.body.status) {
            order.status = req.body.status;
        }

        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Process payment and update order
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
exports.processPayment = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user');

        if (!order) {
            return next(
                new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is order owner or admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User not authorized to update this order`, 401)
            );
        }

        // In a real app, you would process payment here with Stripe or similar
        // For demo, we'll just simulate a successful payment
        order.paymentResult = {
            id: `simulated_payment_${Date.now()}`,
            status: 'completed',
            update_time: new Date().toISOString(),
            email_address: order.user.email
        };
        order.status = 'paid';

        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (err) {
        next(err);
    }
};