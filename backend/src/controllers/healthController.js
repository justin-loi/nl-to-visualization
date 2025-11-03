const { ConversationStore } = require('../stores/conversationStore');

function healthCheck(req, res) {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    conversations: ConversationStore.getInstance().size()
  });
}

function root(req, res) {
  res.json({
    status: 'Backend running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    endpoints: [
      'POST /api/chat',
      'POST /api/chat/stream',
      'GET /health'
    ]
  });
}

module.exports = {
  healthCheck,
  root
};
