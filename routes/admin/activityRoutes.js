const express = require('express');
const { protect, authorize } = require('../../../middleware/auth');
const {
  getActivityLogs,
  filterActivityLogs
} = require('../../../controllers/admin/activityController');

const router = express.Router();

router.use(protect, authorize('admin'));

router.route('/')
  .get(getActivityLogs);

router.route('/filter')
  .get(filterActivityLogs);

module.exports = router;