try {
    module.exports = require('./logger');
  } catch (err) {
    // Fallback to console-only logging if logger.js is missing
    console.warn('[WARN] logger.js not found - falling back to console logging');
    
    const dummyLogger = {
      info: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
      _test: {}
    };
    
    module.exports = dummyLogger;
  }