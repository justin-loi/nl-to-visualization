const { ClaudeClient } = require('../clients/claudeClient');
const { ConversationStore } = require('../stores/conversationStore');
const { ChartValidator } = require('../validators/chartValidator');
const { PromptBuilder } = require('../utils/promptBuilder');
const { logger } = require('../utils/logger');

class StreamService {
  constructor(chatService) {
    this.chatService = chatService;
    this.claudeClient = new ClaudeClient();
    this.conversationStore = ConversationStore.getInstance();
    this.chartValidator = new ChartValidator();
    this.promptBuilder = new PromptBuilder();
  }

  async streamChartGeneration(sessionId, message, res, startTime) {
    const history = this.conversationStore.get(sessionId);
    const lastChart = this.conversationStore.getLastChart(sessionId);
    const systemPrompt = this.promptBuilder.buildSystemPrompt(lastChart);

    const timeoutDuration = parseInt(process.env.STREAM_TIMEOUT || '30000');
    const timeoutId = setTimeout(() => {
      this.sendSSE(res, 'error', {
        error: 'Request timeout - chart generation took too long'
      });
      res.end();
    }, timeoutDuration);

    try {
      const stream = await this.claudeClient.streamMessage({
        system: systemPrompt,
        messages: [
          ...history.map(h => ({ role: h.role, content: h.content })),
          { role: 'user', content: message }
        ]
      });

      let fullResponse = '';
      let lastSentChart = null;

      this.sendSSE(res, 'connected', {});

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          const text = chunk.delta.text;
          fullResponse += text;

          this.sendSSE(res, 'text_chunk', { text });

          // Try progressive chart updates
          const partialChart = this._tryParsePartialJSON(fullResponse);
          if (partialChart && JSON.stringify(partialChart) !== JSON.stringify(lastSentChart)) {
            try {
              const validated = this.chartValidator.validate(partialChart);
              this.sendSSE(res, 'chart_update', { chartData: validated });
              lastSentChart = validated;
            } catch (e) {
              // Validation failed, wait for more data
            }
          }
        }
      }

      clearTimeout(timeoutId);

      const chartData = this.chatService._extractJSON(fullResponse);
      const validatedChart = this.chartValidator.validate(chartData);

      this.conversationStore.addMessage(sessionId, 'user', message, null);
      this.conversationStore.addMessage(sessionId, 'assistant', fullResponse, validatedChart);

      const duration = Date.now() - startTime;
      logger.info(`Stream completed in ${duration}ms`);

      this.sendSSE(res, 'complete', {
        chartData: validatedChart,
        message: fullResponse,
        metadata: {
          duration,
          timestamp: new Date().toISOString()
        }
      });

      res.end();

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  sendSSE(res, type, data) {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
  }

  _tryParsePartialJSON(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Not valid yet
    }
    return null;
  }
}

module.exports = { StreamService };