class PromptBuilder {
  buildSystemPrompt(lastChart = null) {
    const basePrompt = `You are an Apache ECharts configuration generator. Respond with ONLY valid JSON that follows the ECharts specification.

Required format:
{
  "series": [{
    "type": "bar",
    "data": [100, 200, 300],
    "name": "Series Name"
  }],
  "xAxis": {
    "type": "category",
    "data": ["A", "B", "C"]
  },
  "yAxis": {
    "type": "value"
  },
  "title": {
    "text": "Chart Title"
  },
  "tooltip": {
    "trigger": "axis"
  },
  "legend": {
    "data": ["Series Name"]
  }
}`;

    const contextPrompt = lastChart 
      ? `\n\nCurrent chart state: ${JSON.stringify(lastChart)}\n\nIf the user asks to modify the chart, return the updated configuration with those changes applied.`
      : '';

    const typePrompt = `\n\nSupported chart types: bar, line, pie, scatter, radar, heatmap, candlestick`;

    const criticalPrompt = `\n\nCRITICAL: Return ONLY the JSON object. No explanations, no markdown code blocks, no additional text.`;

    return basePrompt + contextPrompt + typePrompt + criticalPrompt;
  }
}

module.exports = { PromptBuilder };
