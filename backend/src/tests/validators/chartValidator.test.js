const { ChartValidator } = require('../../../src/validators/chartValidator');

describe('ChartValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new ChartValidator();
  });

  test('should validate a valid chart with series', () => {
    const validChart = {
      series: [{ type: 'bar', data: [1, 2, 3] }]
    };

    const result = validator.validate(validChart);
    expect(result).toEqual(validChart);
  });

  test('should validate chart with optional fields', () => {
    const chart = {
      series: [{ type: 'line', data: [10, 20] }],
      xAxis: { type: 'category' },
      yAxis: { type: 'value' },
      title: { text: 'Test' }
    };

    const result = validator.validate(chart);
    expect(result).toMatchObject(chart);
  });

  test('should parse JSON string', () => {
    const chartString = JSON.stringify({
      series: [{ type: 'pie', data: [1, 2] }]
    });

    const result = validator.validate(chartString);
    expect(result.series).toBeDefined();
    expect(Array.isArray(result.series)).toBe(true);
  });

  test('should throw error for missing series', () => {
    const invalidChart = {
      xAxis: { type: 'category' }
    };

    expect(() => validator.validate(invalidChart)).toThrow();
  });

  test('should throw error for empty series array', () => {
    const invalidChart = {
      series: []
    };

    expect(() => validator.validate(invalidChart)).toThrow();
  });

  test('should throw error for invalid JSON string', () => {
    expect(() => validator.validate('not valid json')).toThrow();
  });
});