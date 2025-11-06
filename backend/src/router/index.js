const express = require('express');
const { rateLimiters } = require('../middleware/rateLimiter');
const chatController = require('../controllers/chatController');
const healthController = require('../controllers/healthController');

function setupRoutes(app) {
  const router = express.Router();

  // Health check
  router.get('/health', rateLimiters.health, healthController.healthCheck);
  router.get('/', healthController.root);

  // Chat endpoints
  // REST API version (keeping for future use)
  router.post('/api/chat', rateLimiters.api, chatController.handleChat);
  // SSE version (currently being used)
  router.post('/api/chat/stream', rateLimiters.stream, chatController.handleStreamChat);

  app.use(router);
}

module.exports = { setupRoutes };