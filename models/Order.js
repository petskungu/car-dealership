const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    cars: [{
        car: {
            type: mongoose.Schema.ObjectId,
            ref: 'Car',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        priceAtPurchase: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    trackingUpdates: [{
        status: String,
        message: String,
        location: String,
        updatedAt: {
          type: Date,
          default: Date.now
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        isCustomerVisible: {
          type: Boolean,
          default: true
        }
      }],
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String
    },
    shippingAddress: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    activityLog: [{
        action: String,
        details: String,
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        performedAt: { type: Date, default: Date.now },
        customerVisible: { type: Boolean, default: false }
      }],
      adminNotes: [{
        content: String,
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
        isInternal: { type: Boolean, default: true }
      }],
      notifications: [{
        type: String,
        sentAt: Date,
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String
      }]
    }, { timestamps: true });


module.exports = mongoose.model('Order', OrderSchema);