const rateLimit = require('express-rate-limit');
const config = require('../config/app.config');

const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for certain endpoints
  skip: (req) => {
    return req.path === '/health' || req.path === '/';
  }
});

// Stricter rate limit for AI endpoints
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit to 20 requests per 15 minutes
  message: {
    success: false,
    error: 'Too many AI requests, please try again later.'
  }
});

// Moderate rate limit for downloader endpoints
const downloaderRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    error: 'Too many download requests, please try again later.'
  }
});

module.exports = {
  rateLimiter,
  aiRateLimiter,
  downloaderRateLimiter
};