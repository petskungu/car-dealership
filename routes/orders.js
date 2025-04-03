const express = require('express');
const {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    processPayment
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getOrders)
    .post(protect, createOrder);

router.route('/:id')
    .get(protect, getOrder)
    .put(protect, authorize('admin'), updateOrder);

router.route('/:id/pay')
    .put(protect, processPayment);

router.route('/user/:userId')
    .get(protect, getOrders);

module.exports = router;