const { ClaudeClient } = require('../clients/claudeClient');
const { ConversationStore } = require('../stores/conversationStore');
const { ChartValidator } = require('../validators/chartValidator');
const { PromptBuilder } = require('../utils/promptBuilder');
const { InsightsService } = require('./insightsService');
const { logger } = require('../utils/logger');

class StreamService {
  constructor(chatService) {
    this.chatService = chatService;
    this.claudeClient = new ClaudeClient();
    this.conversationStore = ConversationStore.getInstance();
    this.chartValidator = new ChartValidator();
    this.promptBuilder = new PromptBuilder();
    this.insightsService = new InsightsService();
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
      
      // Check if it's a non-chart request
      if (chartData.error === 'NOT_A_CHART_REQUEST') {
        this.sendSSE(res, 'error', {
          error: chartData.message || 'This request does not appear to be asking for a chart or visualization.'
        });
        res.end();
        return;
      }
      
      const validatedChart = this.chartValidator.validate(chartData);

      // Send chart immediately while generating insights/questions
      this.sendSSE(res, 'chart_complete', { chartData: validatedChart });

      // Generate insights and follow-up questions in parallel
      logger.info('Generating insights and follow-up questions...');
      
      const insightsPromise = this.insightsService.generateInsights(validatedChart, message)
        .then(insights => {
          this.sendSSE(res, 'insights_update', { insights });
          return insights;
        })
        .catch(error => {
          logger.error('Insights generation failed:', error.message);
          return [];
        });

      const questionsPromise = this.insightsService.generateFollowUpQuestions(validatedChart, message)
        .then(questions => {
          this.sendSSE(res, 'questions_update', { followUpQuestions: questions });
          return questions;
        })
        .catch(error => {
          logger.error('Questions generation failed:', error.message);
          return [];
        });

      const [insights, followUpQuestions] = await Promise.all([
        insightsPromise,
        questionsPromise
      ]);

      this.conversationStore.addMessage(sessionId, 'user', message, null);
      this.conversationStore.addMessage(sessionId, 'assistant', fullResponse, validatedChart);

      const duration = Date.now() - startTime;
      logger.info(`Stream completed in ${duration}ms`);

      // Send final complete event with all data
      this.sendSSE(res, 'complete', {
        success: true,
        chartData: validatedChart,
        message: fullResponse,
        insights,
        followUpQuestions,
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