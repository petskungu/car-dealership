const express = require('express');
const { protect, authorize } = require('../../../middleware/auth');
const {
  addCar,
  updateCar,
  changeCarStatus,
  getInventory,
  searchInventory
} = require('../../../controllers/admin/inventoryController');

const router = express.Router();

router.use(protect, authorize('admin', 'inventory_manager'));

router.route('/')
  .get(getInventory)
  .post(addCar);

router.route('/search')
  .get(searchInventory);

router.route('/:id')
  .put(updateCar);

router.route('/:id/status')
  .put(changeCarStatus);

module.exports = router;