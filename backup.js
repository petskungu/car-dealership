const mongoose = require('mongoose');
const { exec } = require('child_process');
const AWS = require('aws-sdk');
const logger = require('./utils/logger');
const path = require('path');
const fs = require('fs');

const backupDatabase = async () => {
  const backupDir = path.join(__dirname, '../../backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const backupFile = path.join(backupDir, `backup-${new Date().toISOString()}.gz`);
  const conn = mongoose.connection;
  const dbName = conn.db.databaseName;

  return new Promise((resolve, reject) => {
    exec(`mongodump --uri="${process.env.MONGODB_URI}" --archive=${backupFile} --gzip`, 
      async (error, stdout, stderr) => {
        if (error) {
          logger.error('Backup failed:', error);
          return reject(error);
        }

        logger.info(`Local backup created: ${backupFile}`);
        
        if (process.env.AWS_BACKUP_BUCKET) {
          await uploadToS3(backupFile);
        }
        
        resolve();
      });
  });
};

const uploadToS3 = async (filePath) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  const fileContent = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  const params = {
    Bucket: process.env.AWS_BACKUP_BUCKET,
    Key: fileName,
    Body: fileContent
  };

  try {
    await s3.upload(params).promise();
    logger.info(`Backup uploaded to S3: ${fileName}`);
  } catch (err) {
    logger.error('S3 upload failed:', err);
    throw err;
  }
};

module.exports = { backupDatabase };