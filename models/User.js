const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8,
    select: false
  },
  phone: { type: String, encrypted: true },
  preferences: {
    preferredMakes: [String],
    priceRange: {
      min: Number,
      max: Number
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  activity: {
    lastLogin: Date,
    viewedCars: [{
      car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
      timestamp: Date,
      duration: Number
    }],
    searchHistory: [{
      query: String,
      timestamp: Date
    }]
  },
  cart: {
    items: [{
      car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
      addedAt: Date,
      customOptions: Object
    }],
    lastUpdated: Date
  },
  currencyPreferences: {
    code: {
      type: String,
      default: 'USD',
      enum: ['USD', 'GBP', 'KES', 'NGN', 'ZAR', 'INR', 'AED']
    },
    lastUpdated: Date
  },


  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  sessions: [{
    token: String,
    ipAddress: String,
    userAgent: String,
    createdAt: Date,
    expiresAt: Date
  }]
  
},

{ timestamps: true });



// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);