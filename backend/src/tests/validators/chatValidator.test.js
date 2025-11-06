const { validateChatRequest } = require('../../../src/validators/chatValidator');

describe('validateChatRequest', () => {
  test('should validate valid request with sessionId and message', () => {
    const request = {
      sessionId: 'test-session',
      message: 'Create a bar chart'
    };

    const result = validateChatRequest(request);
    expect(result.sessionId).toBe('test-session');
    expect(result.message).toBe('Create a bar chart');
  });

  test('should use default sessionId if not provided', () => {
    const request = {
      message: 'Create a bar chart'
    };

    const result = validateChatRequest(request);
    expect(result.sessionId).toBe('default');
    expect(result.message).toBe('Create a bar chart');
  });

  test('should throw error for missing message', () => {
    const request = {
      sessionId: 'test-session'
    };

    expect(() => validateChatRequest(request)).toThrow();
  });

  test('should throw error for empty message', () => {
    const request = {
      message: ''
    };

    expect(() => validateChatRequest(request)).toThrow();
  });

  test('should throw error for message exceeding max length', () => {
    const request = {
      message: 'a'.repeat(2001)
    };

    expect(() => validateChatRequest(request)).toThrow();
  });

  test('should accept message at max length (2000 chars)', () => {
    const request = {
      message: 'a'.repeat(2000)
    };

    const result = validateChatRequest(request);
    expect(result.message.length).toBe(2000);
  });
});