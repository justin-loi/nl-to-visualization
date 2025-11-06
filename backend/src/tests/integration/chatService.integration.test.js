const { ChartValidator } = require('../../../src/validators/chartValidator');
const { PromptBuilder } = require('../../../src/utils/promptBuilder');
const { ConversationStore } = require('../../../src/stores/conversationStore');

describe('ChatService Integration', () => {
  test('ChartValidator should work with PromptBuilder output structure', () => {
    const validator = new ChartValidator();
    const builder = new PromptBuilder();
    
    const prompt = builder.buildSystemPrompt(null);
    
    // Verify prompt is valid
    expect(prompt).toBeDefined();
    expect(typeof prompt).toBe('string');
    
    // Verify validator can validate expected chart structure
    const sampleChart = {
      series: [{ type: 'bar', data: [1, 2, 3] }]
    };
    
    expect(() => validator.validate(sampleChart)).not.toThrow();
  });

  test('ConversationStore should work with validated chart data', () => {
    ConversationStore.instance = null;
    const store = ConversationStore.getInstance();
    const validator = new ChartValidator();
    
    const chartData = {
      series: [{ type: 'line', data: [10, 20, 30] }]
    };
    
    const validatedChart = validator.validate(chartData);
    
    store.addMessage('test-session', 'assistant', 'Chart created', validatedChart);
    
    const lastChart = store.getLastChart('test-session');
    expect(lastChart).toEqual(validatedChart);
  });
});