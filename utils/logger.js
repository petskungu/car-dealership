const fs = require('fs');
const path = require('path');
const util = require('util');

// Ensure logs directory exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'app.log');

// Create a write stream (in append mode)
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Timestamp format function
const getTimestamp = () => new Date().toISOString();

// Log levels
const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

// Main logger function
const log = (level, message, ...args) => {
  const formattedMessage = typeof message === 'string' ? message : util.inspect(message);
  const fullMessage = `[${getTimestamp()}] [${level}] ${formattedMessage} ${args.length ? util.inspect(args) : ''}\n`;
  
  // Write to console
  if (level === LOG_LEVELS.ERROR) {
    console.error(fullMessage);
  } else if (level === LOG_LEVELS.WARN) {
    console.warn(fullMessage);
  } else {
    console.log(fullMessage);
  }
  
  // Write to file
  logStream.write(fullMessage);
};

// Export logger methods
module.exports = {
  info: (message, ...args) => log(LOG_LEVELS.INFO, message, ...args),
  warn: (message, ...args) => log(LOG_LEVELS.WARN, message, ...args),
  error: (message, ...args) => log(LOG_LEVELS.ERROR, message, ...args),
  debug: (message, ...args) => log(LOG_LEVELS.DEBUG, message, ...args),
  
  // For testing purposes
  _test: {
    logFile,
    resetLog: () => fs.writeFileSync(logFile, '')
  }
};