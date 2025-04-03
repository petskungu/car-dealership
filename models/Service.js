const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  serviceType: String,
  scheduledDate: Date,
  completedDate: Date,
  technicianNotes: String,
  warrantyCovered: Boolean,
  cost: Number,
  partsUsed: [{
    name: String,
    partNumber: String,
    cost: Number
  }]
});