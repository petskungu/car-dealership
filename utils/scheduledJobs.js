const cron = require('node-cron');
const { purgeOldData } = require('./dataRetention');
const { backupDatabase } = require('../backup');
const logger = require('./logger');

// Run daily at 2 AM
cron.schedule('0 2 * * *', () => {
  logger.info('Running daily maintenance jobs');
  purgeOldData();
  
  if (process.env.BACKUP_SCHEDULE === 'daily') {
    backupDatabase();
  }
});

// Run weekly on Sunday at 3 AM
if (process.env.BACKUP_SCHEDULE === 'weekly') {
  cron.schedule('0 3 * * 0', backupDatabase);
}

// Run on the 1st of every month at 4 AM
if (process.env.BACKUP_SCHEDULE === 'monthly') {
  cron.schedule('0 4 1 * *', backupDatabase);
}