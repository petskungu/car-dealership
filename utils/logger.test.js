const logger = require('./getLogger');
const fs = require('fs');
const path = require('path');

describe('Logger', () => {
  const testLogFile = path.join(__dirname, '../logs/app.log');
  
  beforeAll(() => {
    // Clear log file before tests
    if (fs.existsSync(testLogFile)) {
      fs.writeFileSync(testLogFile, '');
    }
  });
  
  it('should log info messages', () => {
    logger.info('Test info message');
    const logContent = fs.readFileSync(testLogFile, 'utf8');
    expect(logContent).toMatch(/\[INFO\] Test info message/);
  });
  
  it('should log error messages', () => {
    logger.error('Test error message');
    const logContent = fs.readFileSync(testLogFile, 'utf8');
    expect(logContent).toMatch(/\[ERROR\] Test error message/);
  });
  
  it('should include timestamps', () => {
    logger.warn('Test timestamp message');
    const logContent = fs.readFileSync(testLogFile, 'utf8');
    expect(logContent).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
  });
  
  it('should handle objects', () => {
    logger.debug({ key: 'value' });
    const logContent = fs.readFileSync(testLogFile, 'utf8');
    expect(logContent).toMatch(/{ key: 'value' }/);
  });
});