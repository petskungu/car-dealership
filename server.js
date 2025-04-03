require("dotenv").config(); // Ensure this is at the top
require('./utils/ensureLogger');
require('./utils/scheduledJobs');

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const app = express();

// In server.js
app.post('/webhooks/delivery', async (req, res) => {
    const { orderId, status, location } = req.body;
    
    await Order.findByIdAndUpdate(orderId, {
      $push: {
        trackingUpdates: {
          status,
          location,
          timestamp: new Date()
        }
      }
    });
    
    res.status(200).json({ success: true });
  });
// After other middleware


// Mount new routes
app.use('/api/v1/compliance', require('./routes/complianceRoutes'));
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'));
app.use('/api/v1/tracking', require('./routes/trackingRoutes'));



// Load env vars
dotenv.config({ path: './config/config.env' });

// Route files
const auth = require('./routes/auth');
const cars = require('./routes/cars');
const orders = require('./routes/orders');
const posts = require('./routes/posts');

// Create Express app


app.post('/webhooks/delivery', async (req, res) => {
    const { orderId, status, location } = req.body;
    
    await Order.findByIdAndUpdate(orderId, {
      $push: {
        trackingUpdates: {
          status,
          location,
          timestamp: new Date()
        }
      }
    });
    
    res.status(200).json({ success: true });
  });

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/cars', cars);
app.use('/api/v1/orders', orders);
app.use('/api/v1/posts', posts);

// Error handler middleware
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected...');
        // Start server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err.message);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});