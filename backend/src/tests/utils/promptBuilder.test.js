const { PromptBuilder } = require('../../../src/utils/promptBuilder');

describe('PromptBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new PromptBuilder();
  });

  test('should build basic system prompt', () => {
    const prompt = builder.buildSystemPrompt(null);
    
    expect(prompt).toBeDefined();
    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(0);
  });

  test('should include key phrases in prompt', () => {
    const prompt = builder.buildSystemPrompt(null);
    
    expect(prompt).toContain('ECharts');
    expect(prompt).toContain('series');
    expect(prompt).toContain('JSON');
  });

  test('should not include chart context when lastChart is null', () => {
    const prompt = builder.buildSystemPrompt(null);
    
    expect(prompt).not.toContain('Current chart state');
  });

  test('should include chart context when lastChart is provided', () => {
    const lastChart = {
      series: [{ type: 'bar', data: [1, 2, 3] }]
    };
    
    const prompt = builder.buildSystemPrompt(lastChart);
    
    expect(prompt).toContain('Current chart state');
    expect(prompt).toContain('bar');
  });

  test('should include supported chart types', () => {
    const prompt = builder.buildSystemPrompt(null);
    
    expect(prompt).toContain('bar');
    expect(prompt).toContain('line');
    expect(prompt).toContain('pie');
  });

  test('should include NOT_A_CHART_REQUEST error format', () => {
    const prompt = builder.buildSystemPrompt(null);
    
    expect(prompt).toContain('NOT_A_CHART_REQUEST');
  });
});