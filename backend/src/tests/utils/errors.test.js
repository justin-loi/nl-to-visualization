const { AppError } = require('../../../src/utils/errors');

describe('AppError', () => {
  test('should create error with message and status code', () => {
    const error = new AppError('Test error', 400);
    
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe('AppError');
  });

  test('should default to status code 500', () => {
    const error = new AppError('Server error');
    
    expect(error.statusCode).toBe(500);
  });

  test('should be instance of Error', () => {
    const error = new AppError('Test');
    
    expect(error).toBeInstanceOf(Error);
  });

  test('should have stack trace', () => {
    const error = new AppError('Test');
    
    expect(error.stack).toBeDefined();
  });
});