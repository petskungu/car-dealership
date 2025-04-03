const mongoose = require('mongoose');

const TrackingPostSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  title: String,
  content: String,
  photos: [String],
  statusUpdate: String,
  timestamp: { type: Date, default: Date.now },
  isCustomerVisible: { type: Boolean, default: true }
});