const mongoose = require('mongoose');

const AdminActionSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { type: String, required: true },
  targetModel: String,
  targetId: mongoose.Schema.Types.ObjectId,
  changes: Object,
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

module.exports = mongoose.model('AdminAction', AdminActionSchema);