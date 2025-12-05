const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const config = require('./config/app.config');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');
const { rateLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler } = require('./middleware/notFoundHandler');

const app = express();

// Security & Performance Middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable for development
}));
app.use(compression());
app.use(cors(config.cors));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(requestLogger);

// Rate Limiting
app.use(rateLimiter);

// Static Files
app.use(express.static(path.join(__dirname, '../public')));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve Frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API Documentation Data
app.get('/apis.json', (req, res) => {
  res.sendFile(path.join(__dirname, '../data/apis.json'));
});

// API Routes
app.use(config.apiPrefix, routes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler (must be last)
app.use(errorHandler);

module.exports = app;