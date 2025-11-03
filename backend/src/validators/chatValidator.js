const { z } = require('zod');
const { AppError } = require('../utils/errors');

const ChatRequestSchema = z.object({
  sessionId: z.string().optional().default('default'),
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message too long (max 2000 characters)')
});

function validateChatRequest(body) {
  try {
    return ChatRequestSchema.parse(body);
  } catch (error) {
    throw new AppError(error.errors[0].message, 400);
  }
}

module.exports = { validateChatRequest };