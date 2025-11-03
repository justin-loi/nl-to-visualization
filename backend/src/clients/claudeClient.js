const Anthropic = require('@anthropic-ai/sdk');
const { AppError } = require('../utils/errors');

class ClaudeClient {
  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new AppError('ANTHROPIC_API_KEY not configured', 500);
    }

    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    this.defaultModel = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929';
    this.maxTokens = parseInt(process.env.MAX_TOKENS || '4096');
  }

  async createMessage(options) {
    try {
      return await this.client.messages.create({
        model: this.defaultModel,
        max_tokens: this.maxTokens,
        ...options
      });
    } catch (error) {
      throw new AppError(`Claude API error: ${error.message}`, 502);
    }
  }

  async streamMessage(options) {
    try {
      return await this.client.messages.stream({
        model: this.defaultModel,
        max_tokens: this.maxTokens,
        ...options
      });
    } catch (error) {
      throw new AppError(`Claude streaming error: ${error.message}`, 502);
    }
  }
}

module.exports = { ClaudeClient };