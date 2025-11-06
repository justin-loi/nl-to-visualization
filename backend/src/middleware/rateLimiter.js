// src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// In-memory rate limiting
const createLimiter = (windowMs, max) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false
    // Remove keyGenerator - default handles IPv6 correctly
  });
};

const rateLimiters = {
  api: createLimiter(60 * 1000, 10),      // 10 requests per minute
  stream: createLimiter(60 * 1000, 10),   // 10 requests per minute
  health: createLimiter(60 * 1000, 100)   // 100 requests per minute
};

module.exports = { rateLimiters };