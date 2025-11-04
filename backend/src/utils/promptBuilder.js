class PromptBuilder {
  buildSystemPrompt(lastChart = null) {
    const basePrompt = `You are an Apache ECharts configuration generator. 

IMPORTANT: If the user's request is NOT asking for a chart, graph, or visualization, respond with:
{
  "error": "NOT_A_CHART_REQUEST",
  "message": "This request does not appear to be asking for a chart or visualization."
}

If the request IS asking for a chart, respond with ONLY valid JSON that follows the ECharts specification:
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