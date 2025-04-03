const express = require('express');
const { protect, authorize } = require('../../../middleware/auth');
const {
  getOrders,
  updateOrderStatus,
  addOrderNote,
  updateDeliveryEstimate,
  searchOrders
} = require('../../../controllers/admin/orderController');

const router = express.Router();

router.use(protect, authorize('admin', 'sales_manager'));

router.route('/')
  .get(getOrders)
  .get('/search', searchOrders);

router.route('/:id/status')
  .put(updateOrderStatus);

router.route('/:id/notes')
  .post(addOrderNote);

router.route('/:id/delivery')
  .put(updateDeliveryEstimate);

module.exports = router;