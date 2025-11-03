const { ChatService } = require('../services/chatService');
const { StreamService } = require('../services/streamService');
const { validateChatRequest } = require('../validators/chatValidator');
const { logger } = require('../utils/logger');

const chatService = new ChatService();
const streamService = new StreamService(chatService);

async function handleChat(req, res) {
  const startTime = Date.now();

  try {
    const { sessionId, message } = validateChatRequest(req.body);

    logger.info(`REST request from session ${sessionId}: "${message.substring(0, 50)}..."`);

    const result = await chatService.generateChart(sessionId, message);

    const duration = Date.now() - startTime;
    logger.info(`Chart generated successfully in ${duration}ms`);

    res.json({
      success: true,
      chart: result.chart,
      message: result.rawResponse,
      metadata: {
        duration,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Error after ${duration}ms:`, error.message);

    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}

async function handleStreamChat(req, res) {
  const startTime = Date.now();

  try {
    const { sessionId, message } = validateChatRequest(req.body);

    logger.info(`Stream request from session ${sessionId}: "${message.substring(0, 50)}..."`);

    // Setup SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    await streamService.streamChartGeneration(sessionId, message, res, startTime);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Stream error after ${duration}ms:`, error.message);

    if (!res.headersSent) {
      res.status(error.statusCode || 500).json({
        error: error.message
      });
    } else {
      streamService.sendSSE(res, 'error', {
        error: error.message
      });
      res.end();
    }
  }
}

module.exports = {
  handleChat,
  handleStreamChat
};