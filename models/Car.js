const mongoose = require('mongoose');


const CarSchema = new mongoose.Schema({
    make: {
        type: String,
        required: [true, 'Please add a make']
    },
    model: {
        type: String,
        required: [true, 'Please add a model']
    },
    year: {
        type: Number,
        required: [true, 'Please add a year']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    discount: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    features: {
        type: [String],
        required: [true, 'Please add features']
    },
    mileage: {
        type: Number,
        required: [true, 'Please add mileage']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    


  // Existing fields...
  status: {
    type: String,
    enum: ['in_stock', 'reserved', 'sold', 'maintenance'],
    default: 'in_stock'
  },
  inCart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  wishlistedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  purchaseCount: { type: Number, default: 0 },
  
  statusHistory: [{
    status: String,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now },
    notes: String
  }],
  adminNotes: [{
    content: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: true }
  }],
  reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  soldAt: Date
}, { timestamps: true });


// Apply Black Friday discount if applicable
CarSchema.methods.getCurrentPrice = function() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JS months are 0-based
    const currentDate = today.getDate();
    
    const [startMonth, startDate] = process.env.BLACK_FRIDAY_START.split('-').map(Number);
    const [endMonth, endDate] = process.env.BLACK_FRIDAY_END.split('-').map(Number);
    
    const isBlackFriday = 
        (currentMonth === startMonth && currentDate >= startDate) ||
        (currentMonth === endMonth && currentDate <= endDate);
    
    if (isBlackFriday) {
        return this.price * (1 - Math.max(this.discount, 0.15)); // Minimum 15% discount on Black Friday
    }
    return this.price * (1 - this.discount);
};

module.exports = mongoose.model('Car', CarSchema);