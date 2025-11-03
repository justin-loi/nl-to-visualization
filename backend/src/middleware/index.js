const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimiters } = require('./rateLimiter');
const { requestLogger } = require('./requestLogger');

function setupMiddleware(app) {
  // Security headers
  app.use(helmet());
  
  // CORS
  app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));

  // Request logging
  app.use(requestLogger);
}

module.exports = { setupMiddleware };