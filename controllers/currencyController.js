const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// @desc    Get supported countries and currencies
// @route   GET /api/v1/currencies/supported
// @access  Public
exports.getSupportedCurrencies = asyncHandler(async (req, res, next) => {
  // In production, this would come from a database or config file
  const supportedCountries = [
    { code: 'US', name: 'United States', currencyCode: 'USD', currencySymbol: '$' },
    { code: 'GB', name: 'United Kingdom', currencyCode: 'GBP', currencySymbol: '£' },
    { code: 'KE', name: 'Kenya', currencyCode: 'KES', currencySymbol: 'KSh' },
    { code: 'NG', name: 'Nigeria', currencyCode: 'NGN', currencySymbol: '₦' },
    { code: 'ZA', name: 'South Africa', currencyCode: 'ZAR', currencySymbol: 'R' },
    { code: 'IN', name: 'India', currencyCode: 'INR', currencySymbol: '₹' },
    { code: 'AE', name: 'United Arab Emirates', currencyCode: 'AED', currencySymbol: 'د.إ' }
  ];

  res.status(200).json(supportedCountries);
});

// @desc    Detect currency based on geolocation
// @route   GET /api/v1/currencies/geolocation
// @access  Public
exports.detectLocationCurrency = asyncHandler(async (req, res, next) => {
  const { lat, lng } = req.query;

  try {
    // Using a geolocation API (e.g., Google Maps, OpenStreetMap)
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    const countryCode = response.data.address.country_code.toUpperCase();
    
    // Map country code to currency
    const countryToCurrency = {
      'US': 'USD',
      'GB': 'GBP',
      'KE': 'KES',
      'NG': 'NGN',
      'ZA': 'ZAR',
      'IN': 'INR',
      'AE': 'AED'
      // Add more mappings as needed
    };

    const currencyCode = countryToCurrency[countryCode] || 'USD';

    res.status(200).json({
      success: true,
      currency: currencyCode
    });
  } catch (err) {
    console.error('Geolocation error:', err);
    return next(new ErrorResponse('Unable to detect location', 400));
  }
});

// @desc    Update user's preferred currency
// @route   PATCH /api/v1/currencies/user
// @access  Private
exports.updateUserCurrency = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { currency: req.body.currency },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get current exchange rates
// @route   GET /api/v1/currencies/rates
// @access  Public
exports.getExchangeRates = asyncHandler(async (req, res, next) => {
  try {
    // Using ExchangeRate-API (replace with your API key)
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`
    );

    res.status(200).json({
      success: true,
      data: response.data.conversion_rates
    });
  } catch (err) {
    console.error('Exchange rate error:', err);
    
    // Fallback rates if API fails
    const fallbackRates = {
      USD: 1,
      GBP: 0.73,
      KES: 110.50,
      NGN: 411.25,
      ZAR: 14.89,
      INR: 74.85,
      AED: 3.67
    };

    res.status(200).json({
      success: true,
      data: fallbackRates,
      message: 'Using fallback exchange rates'
    });
  }
});