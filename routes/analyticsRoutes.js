const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getUserActivity,
  getCarPopularity,
  getSalesData
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/user-activity/:userId', protect, getUserActivity);
router.get('/car-popularity', protect, authorize('admin'), getCarPopularity);
router.get('/sales-data', protect, authorize('admin'), getSalesData);

module.exports = router;