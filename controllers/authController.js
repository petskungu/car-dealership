const jwt = require('jsonwebtoken');
const User = require('../models/User');
exports.login = asyncHandler(async (req, res, next) => {
    // ... existing login logic ...
  
    // After successful authentication
    const userWithPrefs = await User.findById(user.id).select('+currencyPreferences');
    
    // Determine currency to use (user preference > localStorage > default)
    let currencyCode = userWithPrefs.currencyPreferences.code;
    const localStorageCurrency = localStorage.getItem('preferredCurrency');
    
    if (localStorageCurrency) {
      currencyCode = localStorageCurrency;
    }
  
    // Get exchange rates
    const ratesResponse = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`);
    
    // Dispatch to Redux or context
    const currencyData = {
      code: currencyCode,
      symbol: getCurrencySymbol(currencyCode),
      rate: ratesResponse.data.conversion_rates[currencyCode] || 1
    };
  
    // Return token and currency data
    res.status(200).json({
      success: true,
      token,
      currency: currencyData
    });
  });
  
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    // Save session
    user.sessions.push({
      token,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      expiresAt: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000)
    });
    await user.save();

    // Return user data with cart and wishlist
    const userData = await User.findById(user._id)
      .populate('cart.items.car')
      .populate('wishlist');

    res.status(200).json({
      status: 'success',
      token,
      data: userData
    });
  } catch (err) {
    next(err);
  }
};