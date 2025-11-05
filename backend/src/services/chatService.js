const { ClaudeClient } = require('../clients/claudeClient');
const { ConversationStore } = require('../stores/conversationStore');
const { ChartValidator } = require('../validators/chartValidator');
const { PromptBuilder } = require('../utils/promptBuilder');
const { InsightsService } = require('./insightsService');
const { AppError } = require('../utils/errors');

class ChatService {
  constructor() {
    this.claudeClient = new ClaudeClient();
    this.conversationStore = ConversationStore.getInstance();
    this.chartValidator = new ChartValidator();
    this.promptBuilder = new PromptBuilder();
    this.insightsService = new InsightsService();
  }

  async generateChart(sessionId, message) {
    const history = this.conversationStore.get(sessionId);
    const lastChart = this.conversationStore.getLastChart(sessionId);

    const systemPrompt = this.promptBuilder.buildSystemPrompt(lastChart);

    const response = await this.claudeClient.createMessage({
      system: systemPrompt,
      messages: [
        ...history.map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: message }
      ]
    });

    const responseText = response.content[0].text;
    const chartData = this._extractJSON(responseText);
    
    // Check if it's a non-chart request
    if (chartData.error === 'NOT_A_CHART_REQUEST') {
      throw new AppError(chartData.message || 'This request does not appear to be asking for a chart or visualization.', 400);
    }
    
    const validatedChart = this.chartValidator.validate(chartData);

    // Generate insights and follow-up questions in parallel
    const [insights, followUpQuestions] = await Promise.all([
      this.insightsService.generateInsights(validatedChart, message),
      this.insightsService.generateFollowUpQuestions(validatedChart, message)
    ]);

    this.conversationStore.addMessage(sessionId, 'user', message, null);
    this.conversationStore.addMessage(sessionId, 'assistant', responseText, validatedChart);

    return {
      chart: validatedChart,
      rawResponse: responseText,
      insights,
      followUpQuestions
    };
  }

  _extractJSON(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      // Try extracting from code blocks
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Try extracting any JSON object
      const objectMatch = text.match(/(\{[\s\S]*\})/);
      if (objectMatch) {
        return JSON.parse(objectMatch[1]);
      }
      
      throw new AppError('Could not extract valid JSON from response', 400);
    }
  }
}

module.exports = { ChatService };