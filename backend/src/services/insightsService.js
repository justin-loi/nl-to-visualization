const { ClaudeClient } = require('../clients/claudeClient');
const { logger } = require('../utils/logger');

class InsightsService {
  constructor() {
    this.claudeClient = new ClaudeClient();
  }

  /**
   * Generate insights about the chart
   */
  async generateInsights(chartData, userMessage) {
    try {
      const prompt = this._buildInsightsPrompt(chartData, userMessage);
      
      const response = await this.claudeClient.createMessage({
        system: 'You are a data analyst providing insights. Return ONLY a JSON array of insight strings.',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024
      });

      const responseText = response.content[0].text;
      const insights = this._parseArrayResponse(responseText);
      
      // Validate insights
      if (!Array.isArray(insights) || insights.length === 0) {
        logger.warn('Invalid insights generated, using defaults');
        return this._getDefaultInsights(chartData);
      }

      return insights.slice(0, 5); // Limit to 5 insights
    } catch (error) {
      logger.error('Failed to generate insights:', error.message);
      return this._getDefaultInsights(chartData);
    }
  }

  /**
   * Generate follow-up questions
   */
  async generateFollowUpQuestions(chartData, userMessage) {
    try {
      const prompt = this._buildFollowUpPrompt(chartData, userMessage);
      
      const response = await this.claudeClient.createMessage({
        system: "You are a helpful assistant suggesting follow-up questions that can be visualized as charts. Return ONLY a JSON array of question strings. Each question must be representable using one of the following chart types: bar, line, pie, scatter, radar, heatmap, or candlestick.",
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512
      });

      const responseText = response.content[0].text;
      const questions = this._parseArrayResponse(responseText);
      
      // Validate questions
      if (!Array.isArray(questions) || questions.length === 0) {
        logger.warn('Invalid questions generated, using defaults');
        return this._getDefaultQuestions(chartData);
      }

      return questions.slice(0, 4); // Limit to 4 questions
    } catch (error) {
      logger.error('Failed to generate follow-up questions:', error.message);
      return this._getDefaultQuestions(chartData);
    }
  }

  _buildInsightsPrompt(chartData, userMessage) {
    const chartType = this._detectChartType(chartData);
    const dataPoints = this._extractDataPoints(chartData);

    return `Analyze this ${chartType} chart and provide 3-5 key insights.

User's request: "${userMessage}"

Chart configuration:
${JSON.stringify(chartData, null, 2)}

Data summary:
- Chart type: ${chartType}
- Data points: ${dataPoints}

Provide insights as a JSON array of strings. Focus on:
1. Key patterns or trends in the data
2. Notable outliers or extremes
3. Comparisons between data points
4. Business or actionable implications

Return ONLY a JSON array like: ["Insight 1", "Insight 2", "Insight 3"]`;
  }

  _buildFollowUpPrompt(chartData, userMessage) {
    const chartType = this._detectChartType(chartData);

    return `Based on this ${chartType} chart, suggest 3-4 relevant follow-up questions the user might ask.

User's original request: "${userMessage}"

Chart type: ${chartType}

Generate questions that would:
1. Explore the data from different angles
2. Drill down into specific aspects
3. Request related visualizations
4. Ask for comparisons or time-based analysis

Return ONLY a JSON array like: ["Question 1?", "Question 2?", "Question 3?"]`;
  }

  _parseArrayResponse(text) {
    try {
      // Try direct parse
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // Try extracting from code blocks
      const jsonMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Try extracting any array
      const arrayMatch = text.match(/(\[[\s\S]*\])/);
      if (arrayMatch) {
        return JSON.parse(arrayMatch[1]);
      }
    }
    
    throw new Error('Could not parse array response');
  }

  _detectChartType(chartData) {
    if (!chartData.series || chartData.series.length === 0) {
      return 'unknown';
    }
    
    const firstSeries = chartData.series[0];
    return firstSeries.type || chartData.type || 'bar';
  }

  _extractDataPoints(chartData) {
    if (!chartData.series) return 0;
    
    const totalPoints = chartData.series.reduce((sum, series) => {
      return sum + (series.data?.length || 0);
    }, 0);
    
    return totalPoints;
  }

  _getDefaultInsights(chartData) {
    const chartType = this._detectChartType(chartData);
    const dataPoints = this._extractDataPoints(chartData);
    
    return [
      `This ${chartType} chart visualizes ${dataPoints} data points`,
      `The chart provides a clear overview of the data distribution`,
      `Consider exploring different time periods or categories for deeper analysis`
    ];
  }

  _getDefaultQuestions(chartData) {
    const chartType = this._detectChartType(chartData);
    
    return [
      `Can you show this data as a different chart type?`,
      `What are the top 3 values in this ${chartType}?`,
      `Can you add a trend line to this chart?`,
      `How does this compare to the previous period?`
    ];
  }
}

module.exports = { InsightsService };