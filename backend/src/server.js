require('dotenv').config();
const express = require('express');
const { setupMiddleware } = require('./middleware');
const { setupRoutes } = require('./router');
const { logger } = require('./utils/logger');
const { gracefulShutdown } = require('./utils/shutdown');

const app = express();

// Setup middleware
setupMiddleware(app);

// Setup routes
setupRoutes(app);

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  logger.info(`✅ Server listening on port ${PORT}`);
  logger.info(`📊 API endpoints:`);
  logger.info(`   - POST http://localhost:${PORT}/api/chat (REST)`);
  logger.info(`   - POST http://localhost:${PORT}/api/chat/stream (SSE)`);
  logger.info(`   - GET  http://localhost:${PORT}/health`);
  logger.info(`🌐 CORS enabled for: ${process.env.ALLOWED_ORIGIN || 'http://localhost:8080'}`);
});

// Graceful shutdown
gracefulShutdown(server);