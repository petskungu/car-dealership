const fs = require('fs');
const path = require('path');

const loggerPath = path.join(__dirname, 'logger.js');

if (!fs.existsSync(loggerPath)) {
  const loggerContent = `const fs = require('fs');
const path = require('path');
const util = require('util');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logStream = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' });

const getTimestamp = () => new Date().toISOString();

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

const log = (level, message, ...args) => {
  const formattedMessage = typeof message === 'string' ? message : util.inspect(message);
  const fullMessage = \`[\${getTimestamp()}] [\${level}] \${formattedMessage} \${args.length ? util.inspect(args) : ''}\\n\`;
  
  if (level === LOG_LEVELS.ERROR) console.error(fullMessage);
  else if (level === LOG_LEVELS.WARN) console.warn(fullMessage);
  else console.log(fullMessage);
  
  logStream.write(fullMessage);
};

module.exports = {
  info: (message, ...args) => log(LOG_LEVELS.INFO, message, ...args),
  warn: (message, ...args) => log(LOG_LEVELS.WARN, message, ...args),
  error: (message, ...args) => log(LOG_LEVELS.ERROR, message, ...args),
  debug: (message, ...args) => log(LOG_LEVELS.DEBUG, message, ...args),
  _test: { logFile: path.join(logDir, 'app.log') }
};`;

  fs.writeFileSync(loggerPath, loggerContent);
  console.log('Created logger.js with default configuration');
}