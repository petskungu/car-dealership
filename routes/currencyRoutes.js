const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getSupportedCurrencies,
  detectLocationCurrency,
  updateUserCurrency,
  getExchangeRates
} = require('../controllers/currencyController');

router.get('/supported', getSupportedCurrencies);
router.get('/geolocation', detectLocationCurrency);
router.get('/rates', getExchangeRates);
router.patch('/user', protect, updateUserCurrency);

module.exports = router;