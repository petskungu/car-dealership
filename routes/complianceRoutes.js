const express = require('express');
const { protect } = require('../middleware/auth');
const { anonymizeUserData } = require('../utils/dataRetention');
const User = require('../models/User');

const router = express.Router();

// GDPR Data Export
router.get('/export-data', protect, async (req, res) => {
  if (process.env.ALLOW_DATA_EXPORT !== 'true') {
    return res.status(403).json({ 
      success: false,
      message: 'Data export is disabled' 
    });
  }

  const user = await User.findById(req.user.id)
    .select('-password')
    .populate('purchaseHistory');
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=user-data.json');
  res.send(JSON.stringify(user, null, 2));
});

// Right to be Forgotten
router.delete('/delete-account', protect, async (req, res) => {
  try {
    await anonymizeUserData(req.user.id);
    res.status(200).json({ 
      success: true,
      message: 'Account data anonymized' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to anonymize data' 
    });
  }
});

module.exports = router;